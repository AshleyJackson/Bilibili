// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSegment, collectUrls } from './stream-fetch';

// Silence the logger
vi.mock('../logger', () => ({
	logInfo: vi.fn(),
	logWarn: vi.fn(),
	logError: vi.fn(),
	logDuration: vi.fn(),
	logFetch: vi.fn()
}));

function mockResponse(body: Uint8Array, init?: { status?: number; contentLength?: number }): Response {
	const status = init?.status ?? 200;
	const headers = new Headers();
	if (init?.contentLength !== undefined) headers.set('content-length', String(init.contentLength));
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(body);
			controller.close();
		}
	});
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText: 'OK',
		headers,
		body: stream,
		arrayBuffer: async () => body.buffer
	} as Response;
}

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('collectUrls', () => {
	it('flattens primary + backups from snake_case fields', () => {
		expect(
			collectUrls({ base_url: 'a', backup_url: ['b', 'c'] })
		).toEqual(['a', 'b', 'c']);
	});

	it('flattens primary + backups from camelCase fields', () => {
		expect(
			collectUrls({ baseUrl: 'a', backupUrl: ['b', 'c'] })
		).toEqual(['a', 'b', 'c']);
	});

	it('drops empty/missing entries', () => {
		expect(
			collectUrls({ base_url: 'a', backup_url: ['', 'b', undefined as unknown as string] })
		).toEqual(['a', 'b']);
	});

	it('returns [] when no primary', () => {
		expect(collectUrls({})).toEqual([]);
	});
});

describe('fetchSegment', () => {
	it('downloads the primary URL when it succeeds', async () => {
		const fetchMock = vi.fn(async () => mockResponse(new Uint8Array([1, 2, 3]), { contentLength: 3 }));
		vi.stubGlobal('fetch', fetchMock);

		const { blob, usedUrl } = await fetchSegment(['https://cdn/video.m4s']);
		expect(usedUrl).toBe('https://cdn/video.m4s');
		expect(await blob.arrayBuffer()).toEqual(new Uint8Array([1, 2, 3]).buffer);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('falls back to backup URLs when primary fails with HTTP error', async () => {
		const okBody = new Uint8Array([9, 9]);
		const fetchMock = vi.fn(async (url: string | URL | Request) => {
			const u = typeof url === 'string' ? url : url.toString();
			if (u === 'https://cdn/primary.m4s') {
				return { ok: false, status: 403, statusText: 'Forbidden', headers: new Headers() } as Response;
			}
			return mockResponse(okBody, { contentLength: 2 });
		});
		vi.stubGlobal('fetch', fetchMock);

		const { blob, usedUrl } = await fetchSegment([
			'https://cdn/primary.m4s',
			'https://bak/backup.m4s'
		]);
		expect(usedUrl).toBe('https://bak/backup.m4s');
		expect(await blob.arrayBuffer()).toEqual(okBody.buffer);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('falls back to second backup when first backup also throws', { timeout: 15_000 }, async () => {
		const okBody = new Uint8Array([7, 7, 7]);
		const failing = new Set(['https://cdn/a.m4s', 'https://cdn/b.m4s']);
		const fetchMock = vi.fn(async (url: string | URL | Request) => {
			const u = typeof url === 'string' ? url : url.toString();
			if (failing.has(u)) throw new Error('network down');
			return mockResponse(okBody, { contentLength: 3 });
		});
		vi.stubGlobal('fetch', fetchMock);

		const { usedUrl } = await fetchSegment([
			'https://cdn/a.m4s',
			'https://cdn/b.m4s',
			'https://cdn/ok.m4s'
		]);
		expect(usedUrl).toBe('https://cdn/ok.m4s');
		// 2 failing URLs × 3 attempts each + 1 success = 7 calls
		expect(fetchMock).toHaveBeenCalledTimes(7);
	});

	it('throws when all URLs fail', { timeout: 15_000 }, async () => {
		const fetchMock = vi.fn(async () => {
			throw new Error('network down');
		});
		vi.stubGlobal('fetch', fetchMock);

		await expect(
			fetchSegment(['https://cdn/a.m4s', 'https://cdn/b.m4s'])
		).rejects.toThrow(/all segment URLs failed/);
		// Each URL gets 3 attempts = 6 total
		expect(fetchMock).toHaveBeenCalledTimes(6);
	});

	it('throws on empty URL list', async () => {
		await expect(fetchSegment([])).rejects.toThrow(/no URLs provided/);
	});

	it('reports progress with received/total and done=true at end', async () => {
		const body = new Uint8Array([1, 2, 3, 4]);
		vi.stubGlobal('fetch', vi.fn(async () => mockResponse(body, { contentLength: 4 })));
		const events: { received: number; total: number; done: boolean }[] = [];
		await fetchSegment(['https://cdn/v.m4s'], (info) => events.push({ ...info }));
		const last = events[events.length - 1];
		expect(last.done).toBe(true);
		expect(last.total).toBe(4);
		expect(last.received).toBe(4);
	});
});