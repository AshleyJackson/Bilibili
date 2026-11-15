import { describe, expect, it } from 'vitest';
import {
	decodeBase64,
	decodeStreamWorkerChunk,
	encodeBase64,
	isAllowedStreamUrl,
	isBilibiliPageUrl,
	isPageStreamControlMessage,
	isPageStreamFetchRequest,
	isPageStreamMessage,
	isStreamWorkerMessage,
	STREAM_FETCH_REQUEST_TYPE,
	STREAM_FETCH_SOURCE
} from './stream-download-protocol';

describe('stream download protocol', () => {
	it('accepts only HTTPS Bilibili stream hosts', () => {
		expect(isAllowedStreamUrl('https://upos-sz-mirror.bilivideo.com/video.m4s?sign=test')).toBe(true);
		expect(isAllowedStreamUrl('https://upos-hz-mirrorakam.akamaized.net/video.m4s')).toBe(true);
		expect(isAllowedStreamUrl('https://mirror.bilivideo.com/video.m4s')).toBe(false);
		expect(isAllowedStreamUrl('https://other.akamaized.net/video.m4s')).toBe(false);
		expect(isAllowedStreamUrl('http://upos-sz-mirror.bilivideo.com/video.m4s')).toBe(false);
		expect(isAllowedStreamUrl('https://bilivideo.com.evil.example/video.m4s')).toBe(false);
		expect(isAllowedStreamUrl('https://example.com/video.m4s')).toBe(false);
		expect(isAllowedStreamUrl('https://upos-sz-mirror.bilivideo.com/video.m3u8')).toBe(false);
		expect(isAllowedStreamUrl('https://user@upos-sz-mirror.bilivideo.com/video.m4s')).toBe(false);
	});

	it('accepts only Bilibili page sender URLs', () => {
		expect(isBilibiliPageUrl('https://www.bilibili.com/video/BV123')).toBe(true);
		expect(isBilibiliPageUrl('http://bilibili.com/video/BV123')).toBe(true);
		expect(isBilibiliPageUrl('https://other.bilibili.com/video/BV123')).toBe(false);
		expect(isBilibiliPageUrl('https://bilibili.com.example/video/BV123')).toBe(false);
		expect(isBilibiliPageUrl(undefined)).toBe(false);
	});

	it('validates bridge request and response messages', () => {
		expect(
			isPageStreamFetchRequest({
				source: STREAM_FETCH_SOURCE,
				type: 'request',
				requestType: STREAM_FETCH_REQUEST_TYPE,
				url: 'https://upos-sz-mirror.bilivideo.com/video.m4s'
			})
		).toBe(true);
		expect(isPageStreamFetchRequest({ source: STREAM_FETCH_SOURCE, type: 'request', url: 'x' })).toBe(false);
		expect(
			isStreamWorkerMessage({
				type: 'response',
				status: 206,
				statusText: 'Partial Content',
				contentLength: '5'
			})
		).toBe(true);
		expect(isStreamWorkerMessage({ type: 'chunk', sequence: 0, data: 'YWJj' })).toBe(true);
		expect(isStreamWorkerMessage({ type: 'chunk', data: 'YWJj' })).toBe(false);
		expect(isPageStreamControlMessage({ type: 'ack', sequence: 0 })).toBe(true);
		expect(isPageStreamControlMessage({ type: 'ack', sequence: -1 })).toBe(false);
		expect(isPageStreamControlMessage({ type: 'abort' })).toBe(true);
		expect(isPageStreamMessage({ type: 'chunk', sequence: 0, buffer: new ArrayBuffer(5) })).toBe(true);
		expect(isPageStreamMessage({ type: 'chunk', data: 'YWJj' })).toBe(false);
		expect(isPageStreamMessage({ type: 'chunk', buffer: new ArrayBuffer(5) })).toBe(false);
	});

	it('encodes and decodes stream bytes without changing them', () => {
		const bytes = new Uint8Array([0, 1, 2, 127, 128, 255]);
		expect(new Uint8Array(decodeBase64(encodeBase64(bytes)))).toEqual(bytes);
	});

	it('preserves the sequence when decoding a worker chunk for the page', () => {
		const bytes = new Uint8Array([1, 2, 3]);
		const pageMessage = decodeStreamWorkerChunk({
			type: 'chunk',
			sequence: 7,
			data: encodeBase64(bytes)
		});

		expect(pageMessage.sequence).toBe(7);
		expect(new Uint8Array(pageMessage.buffer)).toEqual(bytes);
	});
});
