// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAsBlob, fetchWithProgress, streamDownload, toUint8Array } from './fetch-utils';
import { STREAM_FETCH_DEFAULTS } from './constants';

vi.mock('./logger', () => ({
	logInfo: vi.fn(),
	logWarn: vi.fn(),
	logError: vi.fn(),
	logFetch: vi.fn(() => vi.fn())
}));

function responseFrom(bytes: number[], headers: Record<string, string> = {}): Response {
	return new Response(new Uint8Array(bytes), { headers });
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('fetchWithProgress', () => {
	it('streams bytes and reports incremental progress', async () => {
		const fetchMock = vi.fn(async () => responseFrom([1, 2, 3], { 'content-length': '3' }));
		vi.stubGlobal('fetch', fetchMock);
		const progress: { received: number; delta: number; done: boolean }[] = [];

		const result = await fetchWithProgress('https://cdn.example/video', (info) => progress.push(info));

		expect(Array.from(new Uint8Array(result))).toEqual([1, 2, 3]);
		expect(fetchMock).toHaveBeenCalledWith('https://cdn.example/video', STREAM_FETCH_DEFAULTS);
		expect(progress.some((info) => info.received === 3 && info.done)).toBe(true);
		expect(progress.filter((info) => !info.done).reduce((sum, info) => sum + info.delta, 0)).toBe(3);
	});

	it('falls back to arrayBuffer when a stream reader is unavailable', async () => {
		const arrayBuffer = vi.fn(async () => new Uint8Array([4, 5]).buffer);
		vi.stubGlobal(
			'fetch',
			vi.fn(
				async () =>
					({
						headers: new Headers(),
						body: null,
						arrayBuffer
					}) as unknown as Response
			)
		);
		const progress = vi.fn();

		const result = await fetchWithProgress('https://cdn.example/no-reader', progress);

		expect(Array.from(new Uint8Array(result))).toEqual([4, 5]);
		expect(arrayBuffer).toHaveBeenCalledOnce();
		expect(progress).toHaveBeenCalledWith({
			url: 'https://cdn.example/no-reader',
			total: 2,
			received: 2,
			delta: 0,
			done: true
		});
	});

	it('falls back when the stream length does not match its header', async () => {
		const arrayBuffer = vi.fn(async () => new Uint8Array([1, 2, 3]).buffer);
		const body = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(new Uint8Array([1, 2]));
				controller.close();
			}
		});
		vi.stubGlobal(
			'fetch',
			vi.fn(
				async () =>
					({
						headers: new Headers({ 'content-length': '4' }),
						body,
						arrayBuffer
					}) as unknown as Response
			)
		);

		const result = await fetchWithProgress('https://cdn.example/short-stream');

		expect(Array.from(new Uint8Array(result))).toEqual([1, 2, 3]);
		expect(arrayBuffer).toHaveBeenCalledOnce();
	});

	it('rejects when the initial fetch fails', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => Promise.reject(new TypeError('offline')))
		);

		await expect(fetchWithProgress('https://cdn.example/offline')).rejects.toThrow('offline');
	});
});

describe('fetchAsBlob', () => {
	it('wraps the response bytes with the requested MIME type', async () => {
		const nativeUrl = URL;
		const createdBlobs: Blob[] = [];
		const createObjectURL = vi.fn((blob: Blob) => {
			createdBlobs.push(blob);
			return 'blob:fetch-result';
		});
		const mockUrl = class extends nativeUrl {};
		Object.defineProperty(mockUrl, 'createObjectURL', { value: createObjectURL });
		vi.stubGlobal('URL', mockUrl);
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => responseFrom([7, 8]))
		);

		const result = await fetchAsBlob('https://cdn.example/worker.js', 'text/javascript');

		expect(result).toBe('blob:fetch-result');
		const blob = createdBlobs[0];
		expect(blob.type).toBe('text/javascript');
		expect(await blob.arrayBuffer()).toEqual(new Uint8Array([7, 8]).buffer);
	});
});

describe('toUint8Array', () => {
	it('decodes base64 data URIs without making a network request', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		expect(Array.from(await toUint8Array('data:application/octet-stream;base64,AQID'))).toEqual([1, 2, 3]);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fetches string URLs using CDN-safe defaults', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => responseFrom([9, 10]))
		);

		const result = await toUint8Array('https://cdn.example/file.bin');

		expect(Array.from(result)).toEqual([9, 10]);
		expect(fetch).toHaveBeenCalledWith('https://cdn.example/file.bin', STREAM_FETCH_DEFAULTS);
	});

	it('reads Blob inputs as bytes', async () => {
		const result = await toUint8Array(new Blob([new Uint8Array([11, 12])]));
		expect(Array.from(result)).toEqual([11, 12]);
	});
});

describe('streamDownload', () => {
	it('streams a successful response and reports progress', async () => {
		const fetchMock = vi.fn(async () => responseFrom([1, 3, 5], { 'content-length': '3' }));
		vi.stubGlobal('window', { fetch: fetchMock });
		const progress = vi.fn();

		const result = await streamDownload('https://cdn.example/file.mp4', null, progress);

		expect(Array.from(new Uint8Array(await result.arrayBuffer()))).toEqual([1, 3, 5]);
		expect(fetchMock).toHaveBeenCalledWith('https://cdn.example/file.mp4', STREAM_FETCH_DEFAULTS);
		expect(progress).toHaveBeenCalledWith(3, 3);
	});

	it('throws a useful error for an unsuccessful response', async () => {
		vi.stubGlobal('window', {
			fetch: vi.fn(async () => ({
				ok: false,
				status: 403,
				statusText: 'Forbidden'
			}))
		});

		await expect(streamDownload('https://cdn.example/forbidden', null, vi.fn())).rejects.toThrow('HTTP 403 Forbidden');
	});
});
