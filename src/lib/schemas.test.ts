import { describe, expect, it } from 'vitest';
import {
	DashDataSchema,
	DashStreamSchema,
	DownloadResultSchema,
	PlayUrlResponseSchema,
	SettingsSchema,
	VideoDataSchema,
	VideoPageDataSchema
} from './schemas';

const videoData = {
	aid: 1,
	bvid: 'BV123',
	cid: 2,
	title: 'A video',
	pages: [{ page: 1, part: 'Part one', cid: 2 }],
	videoData: {
		aid: 1,
		bvid: 'BV123',
		cid: 2,
		title: 'A video',
		pages: [{ page: 1, part: 'Part one', cid: 2 }]
	}
};

const stream = {
	id: 80,
	base_url: 'https://cdn.example/video.m4s',
	backup_url: ['https://backup.example/video.m4s']
};

describe('VideoDataSchema', () => {
	it('accepts a complete video response', () => {
		expect(VideoDataSchema.parse(videoData)).toEqual(videoData);
	});

	it('validates the video page metadata used by UGC processing', () => {
		expect(VideoPageDataSchema.safeParse(videoData.videoData).success).toBe(true);
		expect(VideoPageDataSchema.safeParse(undefined).success).toBe(false);
		expect(VideoPageDataSchema.safeParse({ ...videoData.videoData, pages: undefined }).success).toBe(false);
	});

	it('allows empty page lists but requires nested video data', () => {
		expect(VideoDataSchema.safeParse({ ...videoData, pages: [] as unknown[] }).success).toBe(true);
		expect(VideoDataSchema.safeParse({ ...videoData, videoData: undefined }).success).toBe(false);
	});
});

describe('stream and playurl schemas', () => {
	it('accepts either Bilibili spelling for the primary stream URL', () => {
		expect(DashStreamSchema.safeParse(stream).success).toBe(true);
		expect(
			DashStreamSchema.safeParse({
				id: 80,
				baseUrl: 'https://cdn.example/video.m4s',
				backupUrl: []
			}).success
		).toBe(true);
	});

	it('requires a primary URL while allowing optional backups', () => {
		expect(DashStreamSchema.safeParse({ id: 80, backup_url: [] }).success).toBe(false);
		expect(DashStreamSchema.safeParse({ id: 80, base_url: 'x', backup_url: 'not-an-array' }).success).toBe(false);
	});

	it('validates audio and video arrays in DASH responses', () => {
		expect(DashDataSchema.safeParse({ audio: [stream], video: [stream] }).success).toBe(true);
		expect(DashDataSchema.safeParse({ audio: stream, video: [] }).success).toBe(false);
	});

	it('accepts DURL and DASH playurl responses', () => {
		expect(
			PlayUrlResponseSchema.safeParse({
				code: 0,
				data: { dash: { audio: [stream], video: [stream] } }
			}).success
		).toBe(true);
		expect(
			PlayUrlResponseSchema.safeParse({
				code: 0,
				data: { durl: [{ url: 'https://cdn.example/video.mp4', backup_url: [] }] }
			}).success
		).toBe(true);
	});

	it('rejects malformed playurl response fields', () => {
		expect(PlayUrlResponseSchema.safeParse({ code: '0' }).success).toBe(false);
		expect(
			PlayUrlResponseSchema.safeParse({
				code: 0,
				data: { durl: [{ url: 'https://cdn.example/video.mp4', backup_url: 'bad' }] }
			}).success
		).toBe(false);
	});

	it('validates the download result shape', () => {
		expect(
			DownloadResultSchema.safeParse({
				code: 0,
				dash: { audio: stream, video: stream },
				qualityDescription: '1080P'
			}).success
		).toBe(true);
		expect(DownloadResultSchema.safeParse({ code: 'ok' }).success).toBe(false);
	});
});

describe('SettingsSchema', () => {
	it('accepts supported settings and rejects unsupported values', () => {
		expect(SettingsSchema.safeParse({ downloadMode: 'advanced', mergeMode: 'on', show: 'show' }).success).toBe(true);
		expect(SettingsSchema.safeParse({ downloadMode: 'auto', mergeMode: 'on', show: 'show' }).success).toBe(false);
	});
});
