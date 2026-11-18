// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchUgcPlayUrl, fetchBangumiPlayUrl } from './bilibili-api';
import { UGC_PLAY_URL_API, BANGUMI_PLAY_URL_API } from './constants';
import { ErrorCode } from './schemas';
import type { DashData } from './schemas';
import { clearWbiKeys } from './wbi';

// Sample DASH response data shared by both endpoints.
const sampleDash: DashData = {
	audio: [{ id: 30280, base_url: 'https://upos-sz-mirror.bilivideo.com/audio.m4s', backup_url: ['https://bak.bilivideo.com/audio.m4s'], size: 1000 }],
	video: [{ id: 120, base_url: 'https://upos-sz-mirror.bilivideo.com/video.m4s', backup_url: ['https://bak.bilivideo.com/video.m4s'], codecid: 7, size: 2000 }]
};

function makeUgcResponse(dash: unknown = sampleDash): unknown {
	return {
		code: 0,
		data: {
			dash,
			video_codecid: 7,
			accept_quality: [120, 80],
			accept_description: ['4K 超高清', '1080P 高清'],
			support_formats: [{ quality: 120, new_description: '4K 超高清' }]
		}
	};
}

function makeBangumiResponse(dash: unknown = sampleDash): unknown {
	return {
		code: 0,
		result: {
			video_info: {
				dash,
				video_codecid: 7,
				accept_quality: [120, 80],
				accept_description: ['4K 超高清', '1080P 高清']
			}
		}
	};
}

interface FetchLog {
	url: string;
}

function mockFetch(responder: (url: string) => unknown): FetchLog[] {
	const calls: FetchLog[] = [];
	const fakeFetch = vi.fn(async (url: string | URL | Request): Promise<Response> => {
		const urlStr = typeof url === 'string' ? url : url.toString();
		calls.push({ url: urlStr });
		const body = JSON.stringify(responder(urlStr));
		return {
			ok: true,
			status: 200,
			json: async () => JSON.parse(body),
			text: async () => body,
			arrayBuffer: async () => new ArrayBuffer(0),
			headers: new Headers()
		} as Response;
	});
	// The api module uses window.fetch and bare fetch interchangeably.
	(globalThis as unknown as { fetch: typeof fetch }).fetch = fakeFetch as unknown as typeof fetch;
	(globalThis as unknown as { window: Window }).window = globalThis as unknown as Window;
	return calls;
}

function setCookie(cookie: string): void {
	Object.defineProperty(document, 'cookie', {
		configurable: true,
		get: vi.fn(() => cookie)
	});
}

describe('fetchUgcPlayUrl', () => {
	beforeEach(() => {
		setCookie('SESSDATA=abc123');
		clearWbiKeys();
	});

	it('calls the WBI playurl endpoint and includes w_rid + wts', async () => {
		const calls = mockFetch((url) => {
			if (url.includes('/web-interface/nav')) {
				return {
					code: 0,
					data: {
						wbi_img: {
							img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png',
							sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png'
						}
					}
				};
			}
			return makeUgcResponse();
		});

		const result = await fetchUgcPlayUrl(12345, undefined, 67890, 120);

		const playurlCall = calls.find((c) => c.url.includes('/wbi/playurl'));
		expect(playurlCall).toBeDefined();
		const search = new URL(playurlCall!.url).searchParams;
		expect(search.get('w_rid')).toMatch(/^[0-9a-f]{32}$/);
		expect(search.get('wts')).toMatch(/^\d+$/);
		expect(search.get('avid')).toBe('12345');
		expect(search.get('cid')).toBe('67890');
		expect(search.get('qn')).toBe('120');
		expect(search.get('fnval')).toBe('4048');

		expect(result.code).toBe(0);
		expect(result.dash?.audio.base_url).toContain('audio.m4s');
		expect(result.dash?.video.base_url).toContain('video.m4s');
	});

	it('includes bvid instead of avid when provided', async () => {
		const calls = mockFetch((url) => {
			if (url.includes('/nav')) return { code: 0, data: { wbi_img: { img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png', sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png' } } };
			return makeUgcResponse();
		});

		await fetchUgcPlayUrl(undefined, 'BV1xx411x', 67890, 120);

		const playurlCall = calls.find((c) => c.url.includes('/wbi/playurl'))!;
		const search = new URL(playurlCall.url).searchParams;
		expect(search.get('bvid')).toBe('BV1xx411x');
		expect(search.has('avid')).toBe(false);
	});

	it('adds try_look=1 when not logged in', async () => {
		setCookie('');
		const calls = mockFetch((url) => {
			if (url.includes('/nav')) return { code: 0, data: { wbi_img: { img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png', sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png' } } };
			return makeUgcResponse();
		});

		await fetchUgcPlayUrl(12345, undefined, 67890, 120);

		const playurlCall = calls.find((c) => c.url.includes('/wbi/playurl'))!;
		const search = new URL(playurlCall.url).searchParams;
		expect(search.get('try_look')).toBe('1');
	});

	it('returns VIP_ONLY error code on code -10403', async () => {
		mockFetch((url) => {
			if (url.includes('/nav')) return { code: 0, data: { wbi_img: { img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png', sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png' } } };
			return { code: -10403, message: '大会员专享' };
		});

		const result = await fetchUgcPlayUrl(12345, undefined, 67890, 120);
		expect(result.code).toBe(-10403);
		expect(result.message).toContain('大会员');
	});

	it('returns FAILED_TO_FETCH when WBI key fetching fails', async () => {
		const calls = mockFetch((url) => {
			if (url.includes('/nav')) throw new TypeError('Failed to fetch');
			return makeUgcResponse();
		});
		Object.defineProperty(window, '__INITIAL_STATE__', { configurable: true, value: undefined });

		const result = await fetchUgcPlayUrl(12345, undefined, 67890, 120);

		expect(result).toEqual({
			code: ErrorCode.FAILED_TO_FETCH,
			message: '网络请求失败'
		});
		expect(calls).toHaveLength(1);
	});

	it.each([
		['null audio', { audio: null, video: sampleDash.video }],
		['malformed audio entry', { audio: [null], video: sampleDash.video }],
		['null video', { audio: sampleDash.audio, video: null }]
	])('returns INVALID_RESPONSE for DASH with %s', async (_field, dash) => {
		mockFetch((url) => {
			if (url.includes('/nav'))
				return {
					code: 0,
					data: {
						wbi_img: {
							img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png',
							sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png'
						}
					}
				};
			return makeUgcResponse(dash);
		});

		const result = await fetchUgcPlayUrl(12345, undefined, 67890, 120);

		expect(result).toEqual({
			code: ErrorCode.INVALID_RESPONSE,
			message: '该视频暂时不支持下载'
		});
	});
});

describe('fetchBangumiPlayUrl', () => {
	beforeEach(() => {
		setCookie('SESSDATA=abc123');
	});

	it('calls the PGC v2 endpoint with module=bangumi and ep_id, without w_rid', async () => {
		const calls = mockFetch(() => makeBangumiResponse());

		const result = await fetchBangumiPlayUrl(123456, 67890, 120);

		const playurlCall = calls.find((c) => c.url.includes('/pgc/player/web/v2/playurl'));
		expect(playurlCall).toBeDefined();
		expect(playurlCall!.url).toContain(BANGUMI_PLAY_URL_API);
		expect(playurlCall!.url).not.toContain(UGC_PLAY_URL_API);

		const search = new URL(playurlCall!.url).searchParams;
		expect(search.get('module')).toBe('bangumi');
		expect(search.get('ep_id')).toBe('123456');
		expect(search.get('cid')).toBe('67890');
		expect(search.get('qn')).toBe('120');
		expect(search.get('fnval')).toBe('4048');
		expect(search.get('from_client')).toBe('BROWSER');
		expect(search.get('session')).toBe('');
		// Bangumi v2 does not use WBI signing.
		expect(search.has('w_rid')).toBe(false);

		expect(result.code).toBe(0);
		expect(result.dash?.video.base_url).toContain('video.m4s');
	});

	it('adds try_look=1 when not logged in', async () => {
		setCookie('');
		const calls = mockFetch(() => makeBangumiResponse());

		await fetchBangumiPlayUrl(123456, 67890, 120);

		const playurlCall = calls.find((c) => c.url.includes('/pgc/player/web/v2/playurl'))!;
		expect(new URL(playurlCall.url).searchParams.get('try_look')).toBe('1');
	});

	it('returns VIP_ONLY error code on code -10403', async () => {
		mockFetch(() => ({ code: -10403, message: '大会员专享' }));

		const result = await fetchBangumiPlayUrl(123456, 67890, 120);
		expect(result.code).toBe(-10403);
	});

	it.each([
		['null audio', { audio: null, video: sampleDash.video }],
		['malformed audio entry', { audio: [null], video: sampleDash.video }],
		['null video', { audio: sampleDash.audio, video: null }]
	])('returns INVALID_RESPONSE for DASH with %s', async (_field, dash) => {
		mockFetch(() => makeBangumiResponse(dash));

		const result = await fetchBangumiPlayUrl(123456, 67890, 120);

		expect(result).toEqual({
			code: ErrorCode.INVALID_RESPONSE,
			message: '该视频暂时不支持下载'
		});
	});
});
