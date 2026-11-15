// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadStream, streamToSegment, downloadDurlSegments, extensionForUrl } from './orchestration';
import { fetchStreamThroughExtension } from '../stream-download-client';

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

beforeEach(() => {
	vi.restoreAllMocks();
	extensionFetchMock.mockReset();
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
