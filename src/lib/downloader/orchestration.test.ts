// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	downloadAndMerge,
	downloadStream,
	streamToSegment,
	downloadDurlSegments,
	extensionForUrl
} from './orchestration';
import { fetchStreamThroughExtension } from '../stream-download-client';
import { mergeAudioVideo } from '../ffmpeg';
import { CONTENT_SCRIPT_ELEMENT_ID } from '../constants';

// Silence the logger
vi.mock('../logger', () => ({
	logInfo: vi.fn(),
	logWarn: vi.fn(),
	logError: vi.fn(),
	logDuration: vi.fn(),
	logFetch: vi.fn()
}));

// Mock mergeAudioVideo so downloadAndMerge tests don't need FFmpeg WASM.
vi.mock('../ffmpeg', () => ({
	mergeAudioVideo: vi.fn(async () => {
		const data = new ArrayBuffer(8);
		return [data, () => {}] as [ArrayBuffer, () => void];
	})
}));

vi.mock('../stream-download-client', () => ({
	fetchStreamThroughExtension: vi.fn()
}));

const extensionFetchMock = vi.mocked(fetchStreamThroughExtension);
const mergeAudioVideoMock = vi.mocked(mergeAudioVideo);

beforeEach(() => {
	vi.restoreAllMocks();
	extensionFetchMock.mockReset();
	mergeAudioVideoMock.mockReset().mockResolvedValue([new ArrayBuffer(8), () => {}]);
});

describe('streamToSegment', () => {
	it('maps snake_case stream to { url, backups, size }', () => {
		const seg = streamToSegment({
			base_url: 'https://cdn/v.m4s',
			backup_url: ['https://bak/v.m4s'],
			size: 1234
		});
		expect(seg.url).toBe('https://cdn/v.m4s');
		expect(seg.backups).toEqual(['https://bak/v.m4s']);
		expect(seg.size).toBe(1234);
	});

	it('maps camelCase stream', () => {
		const seg = streamToSegment({
			baseUrl: 'https://cdn/v.m4s',
			backupUrl: ['https://bak/v.m4s']
		});
		expect(seg.url).toBe('https://cdn/v.m4s');
		expect(seg.backups).toEqual(['https://bak/v.m4s']);
	});
});

describe('downloadStream', () => {
	it('downloads primary URL when it succeeds', async () => {
		const body = new Uint8Array([1, 2]);
		extensionFetchMock.mockImplementation(
			vi.fn(async () => {
				const stream = new ReadableStream<Uint8Array>({
					start(c) {
						c.enqueue(body);
						c.close();
					}
				});
				return {
					ok: true,
					status: 200,
					headers: new Headers({ 'content-length': '2' }),
					body: stream,
					arrayBuffer: async () => body.buffer
				} as Response;
			})
		);
		const blob = await downloadStream({
			url: 'https://cdn/v.m4s',
			backups: ['https://bak/v.m4s']
		});
		expect(await blob.arrayBuffer()).toEqual(body.buffer);
	});

	it('throws when segment has no usable URLs', async () => {
		await expect(downloadStream({ url: '' })).rejects.toThrow(/no usable URLs/);
	});

	it('falls back to backup when primary 403s', async () => {
		const okBody = new Uint8Array([5, 5, 5]);
		extensionFetchMock.mockImplementation(
			vi.fn(async (url: string) => {
				if (url === 'https://cdn/v.m4s') {
					return { ok: false, status: 403, statusText: 'Forbidden', headers: new Headers() } as Response;
				}
				const stream = new ReadableStream<Uint8Array>({
					start(c) {
						c.enqueue(okBody);
						c.close();
					}
				});
				return {
					ok: true,
					status: 200,
					headers: new Headers({ 'content-length': '3' }),
					body: stream,
					arrayBuffer: async () => okBody.buffer
				} as Response;
			})
		);
		const blob = await downloadStream({
			url: 'https://cdn/v.m4s',
			backups: ['https://bak/v.m4s']
		});
		expect(await blob.arrayBuffer()).toEqual(okBody.buffer);
	});
});

describe('downloadDurlSegments', () => {
	it('downloads and concatenates segments in order', async () => {
		const a = new Uint8Array([1]);
		const b = new Uint8Array([2, 3]);
		let call = 0;
		extensionFetchMock.mockImplementation(
			vi.fn(async () => {
				const body = call++ === 0 ? a : b;
				const stream = new ReadableStream<Uint8Array>({
					start(c) {
						c.enqueue(body);
						c.close();
					}
				});
				return {
					ok: true,
					status: 200,
					headers: new Headers(),
					body: stream,
					arrayBuffer: async () => body.buffer
				} as Response;
			})
		);
		const blob = await downloadDurlSegments([{ url: 'https://cdn/a.mp4' }, { url: 'https://cdn/b.mp4' }]);
		const buf = new Uint8Array(await blob.arrayBuffer());
		expect(Array.from(buf)).toEqual([1, 2, 3]);
	});
});

describe('downloadAndMerge', () => {
	function addInternals(): void {
		document.getElementById(CONTENT_SCRIPT_ELEMENT_ID)?.remove();
		const el = document.createElement('div');
		el.id = CONTENT_SCRIPT_ELEMENT_ID;
		el.dataset.internals = JSON.stringify({
			manifest: { name: 'Bilibili helper', version: '3.2.0' },
			baseUrl: 'chrome-extension://extension-id'
		});
		document.body.appendChild(el);
	}

	function mockDownloadedStreams(): void {
		extensionFetchMock.mockImplementation(async () => new Response(new Uint8Array([1, 2])));
	}

	it('passes downloaded Blobs directly to FFmpeg', async () => {
		addInternals();
		mockDownloadedStreams();

		const result = await downloadAndMerge({
			audio: { url: 'https://cdn.example/audio.m4s' },
			video: { url: 'https://cdn.example/video.m4s' }
		});

		expect(result.data).toBeInstanceOf(ArrayBuffer);
		expect(mergeAudioVideo).toHaveBeenCalledOnce();
		expect(mergeAudioVideo).toHaveBeenCalledWith('chrome-extension://extension-id', expect.any(Blob), expect.any(Blob));
	});

	it('propagates merge read failures for the existing UI error handler', async () => {
		addInternals();
		mockDownloadedStreams();
		const readError = new Error('Unable to read file data. Please try the download again.');
		mergeAudioVideoMock.mockRejectedValueOnce(readError);

		await expect(
			downloadAndMerge({
				audio: { url: 'https://cdn.example/audio.m4s' },
				video: { url: 'https://cdn.example/video.m4s' }
			})
		).rejects.toBe(readError);
	});

	it('signals the merge phase after both streams finish and before FFmpeg runs', async () => {
		const order: string[] = [];
		extensionFetchMock.mockImplementation(
			vi.fn(async (url: string) => {
				const body = new Uint8Array([url.includes('audio') ? 1 : 2]);
				const stream = new ReadableStream<Uint8Array>({
					start(c) {
						c.enqueue(body);
						c.close();
					}
				});
				order.push(`fetch:${url.includes('audio') ? 'audio' : 'video'}`);
				return { ok: true, status: 200, headers: new Headers({ 'content-length': '1' }), body: stream } as Response;
			})
		);
		mergeAudioVideoMock.mockImplementationOnce(async () => {
			order.push('merge');
			return [new ArrayBuffer(4), () => {}];
		});
		addInternals();
		const progress = vi.fn();

		const result = await downloadAndMerge(
			{ audio: { url: 'https://cdn/audio.m4s' }, video: { url: 'https://cdn/video.m4s' } },
			progress,
			() => order.push('merging')
		);

		expect(order.slice(-2)).toEqual(['merging', 'merge']);
		expect(progress).toHaveBeenCalledWith('audio', 1, 1);
		expect(progress).toHaveBeenCalledWith('video', 1, 1);
		expect(result.data.byteLength).toBe(4);
	});
});

describe('extensionForUrl', () => {
	it('maps .m4s to .mp4', () => {
		expect(extensionForUrl('https://cdn/x.m4s?e=expire')).toBe('.mp4');
	});

	it('keeps other extensions', () => {
		expect(extensionForUrl('https://cdn/x.mp4')).toBe('.mp4');
	});

	it('returns empty for no extension', () => {
		expect(extensionForUrl('https://cdn/x')).toBe('');
	});
});
