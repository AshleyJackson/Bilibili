import { describe, expect, it } from 'vitest';
import { createAdvancedNoMergeLinks, createMergeLink, createNormalDownloadLink, type LinkOptions } from './download';

const segments = [
	{ url: 'https://cdn.example/video.m4s?token=one', backups: ['https://backup.example/video.m4s'], size: 1024 },
	{ url: 'https://cdn.example/audio.m4s?token=two', backups: [], size: 2048 }
];

const options: LinkOptions = {
	filename: 'lesson',
	segments,
	isDash: true
};

describe('createNormalDownloadLink', () => {
	it('creates separate audio and video links with size labels', () => {
		const html = createNormalDownloadLink(options);

		expect(html).toContain('title="lesson_音频"');
		expect(html).toContain('href="https://cdn.example/video.m4s?token=one"');
		expect(html).toContain('title="lesson_视频"');
		expect(html).toContain('(1.00KB)');
		expect(html).toContain('(2.00KB)');
	});

	it('labels non-DASH segments in sequence', () => {
		const html = createNormalDownloadLink({ ...options, isDash: false });
		expect(html).toContain('分段1');
		expect(html).toContain('分段2');
	});

	it('returns an empty string when there are no segments', () => {
		expect(createNormalDownloadLink({ ...options, segments: [] })).toBe('');
	});
});

describe('createAdvancedNoMergeLinks', () => {
	it('encodes each segment and its backup URLs in the link data', () => {
		const html = createAdvancedNoMergeLinks(options);
		const encoded = html.match(/durl="([^"]+)"/)?.[1];

		expect(encoded).toBeDefined();
		expect(JSON.parse(decodeURIComponent(encoded!))).toEqual([segments[0]]);
		expect(html).toContain('merge="off"');
	});

	it('returns an empty string when there are no segments', () => {
		expect(createAdvancedNoMergeLinks({ ...options, segments: [] })).toBe('');
	});
});

describe('createMergeLink', () => {
	it('encodes both DASH segments and reports their combined size', () => {
		const html = createMergeLink(options);
		const encoded = html.match(/durls="([^"]+)"/)?.[1];

		expect(encoded).toBeDefined();
		expect(JSON.parse(decodeURIComponent(encoded!))).toEqual(segments);
		expect(html).toContain('(共3.00KB)');
		expect(html).toContain('merge="on"');
	});

	it('treats missing segment sizes as zero', () => {
		expect(createMergeLink({ ...options, segments: [{ url: 'https://cdn.example/video' }] })).toContain('(共未知大小)');
	});
});
