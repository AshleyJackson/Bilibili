import { describe, expect, it } from 'vitest';
import { buildDownloadOptions, codecLabel, describeStreams, sanitizeFilename, type DisplayInfo } from './download';
import { ErrorCode } from './schemas';

const dashInfo: DisplayInfo = {
	code: ErrorCode.OK,
	title: 'lesson',
	quality: '1080P 高清',
	dash: {
		audio: {
			id: 30280,
			base_url: 'https://cdn.example/audio.m4s',
			backup_url: ['https://bak.example/audio.m4s'],
			size: 1024
		},
		video: {
			id: 80,
			base_url: 'https://cdn.example/video.m4s',
			backup_url: [],
			size: 2048,
			codecs: 'avc1.640032',
			width: 1920,
			height: 1080
		}
	}
};

describe('buildDownloadOptions', () => {
	it('offers merged, video-only and audio-only downloads for DASH streams', () => {
		const options = buildDownloadOptions(dashInfo);

		expect(options.map((o) => o.kind)).toEqual(['merged', 'video', 'audio']);
		expect(options.map((o) => o.filename)).toEqual(['lesson.mp4', 'lesson_视频.mp4', 'lesson_音频.m4a']);
		expect(options[0]).toMatchObject({ recommended: true, size: 3072, format: 'MP4' });
		expect(options[0].segments).toEqual([
			{ url: 'https://cdn.example/audio.m4s', backups: ['https://bak.example/audio.m4s'], size: 1024 },
			{ url: 'https://cdn.example/video.m4s', backups: [], size: 2048 }
		]);
		expect(options[1]).toMatchObject({ recommended: false, size: 2048 });
		expect(options[2]).toMatchObject({ format: 'M4A', size: 1024 });
	});

	it('uses distinct, URL-derived ids so state resets when streams change', () => {
		const ids = buildDownloadOptions(dashInfo).map((o) => o.id);
		expect(new Set(ids).size).toBe(3);
		expect(ids[0]).toContain('https://cdn.example/video.m4s');
	});

	it('leaves the merged size unknown when either stream size is missing', () => {
		const info: DisplayInfo = {
			...dashInfo,
			dash: { audio: { ...dashInfo.dash!.audio, size: undefined }, video: dashInfo.dash!.video }
		};
		expect(buildDownloadOptions(info)[0].size).toBeUndefined();
	});

	it('offers a single full-video file for one DURL segment', () => {
		const options = buildDownloadOptions({
			code: ErrorCode.OK,
			title: 'clip',
			durl: [{ url: 'https://cdn.example/clip.flv?x=1', backup_url: ['https://bak.example/clip.flv'], size: 10 }]
		});

		expect(options).toHaveLength(1);
		expect(options[0]).toMatchObject({
			kind: 'file',
			label: '完整视频',
			format: 'FLV',
			filename: 'clip.flv',
			recommended: true
		});
		expect(options[0].segments[0].backups).toEqual(['https://bak.example/clip.flv']);
	});

	it('numbers multiple DURL segments', () => {
		const options = buildDownloadOptions({
			code: ErrorCode.OK,
			title: 'clip',
			durl: [{ url: 'https://cdn.example/a.mp4' }, { url: 'https://cdn.example/b.mp4' }]
		});

		expect(options.map((o) => o.label)).toEqual(['分段 1/2', '分段 2/2']);
		expect(options.map((o) => o.filename)).toEqual(['clip_分段1.mp4', 'clip_分段2.mp4']);
		expect(options.every((o) => !o.recommended)).toBe(true);
	});

	it('returns nothing for failed lookups', () => {
		expect(buildDownloadOptions({ code: ErrorCode.VIP_ONLY, message: 'vip' })).toEqual([]);
	});
});

describe('sanitizeFilename', () => {
	it('replaces characters that are reserved in filenames', () => {
		expect(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j')).toBe('a_b_c_d_e_f_g_h_i_j');
	});

	it('collapses whitespace and control characters, trims dots', () => {
		expect(sanitizeFilename('  ..hello\n\tworld..  ')).toBe('hello world');
	});

	it('falls back to a default name when nothing is left', () => {
		expect(sanitizeFilename('...')).toBe('bilibili');
	});

	it('caps very long titles', () => {
		expect(sanitizeFilename('x'.repeat(500))).toHaveLength(180);
	});
});

describe('codecLabel', () => {
	it('recognizes codec strings and falls back to codec ids', () => {
		expect(codecLabel({ codecs: 'avc1.640032' })).toBe('AVC');
		expect(codecLabel({ codecs: 'hev1.1.6.L120.90' })).toBe('HEVC');
		expect(codecLabel({ codecs: 'av01.0.08M.08' })).toBe('AV1');
		expect(codecLabel({ codecid: 12 })).toBe('HEVC');
		expect(codecLabel({})).toBeUndefined();
	});
});

describe('describeStreams', () => {
	it('lists resolution and codec for DASH', () => {
		expect(describeStreams(dashInfo)).toEqual(['1920×1080', 'AVC']);
	});

	it('lists the container for DURL', () => {
		expect(describeStreams({ code: ErrorCode.OK, durl: [{ url: 'https://cdn.example/a.flv' }] })).toEqual(['FLV']);
	});

	it('is empty on error', () => {
		expect(describeStreams({ code: ErrorCode.UNKNOWN })).toEqual([]);
	});
});
