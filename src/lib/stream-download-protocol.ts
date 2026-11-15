export const STREAM_FETCH_SOURCE = 'bilibili-helper-stream-fetch';
export const STREAM_FETCH_PORT_NAME = 'bilibili-helper-stream-fetch';
export const STREAM_FETCH_REQUEST_TYPE = 'bilibili-helper:stream-fetch';

export interface PageStreamFetchRequest {
	source: typeof STREAM_FETCH_SOURCE;
	type: 'request';
	requestType: typeof STREAM_FETCH_REQUEST_TYPE;
	url: string;
}

export type StreamWorkerRequest =
	{ type: 'fetch'; url: string } | { type: 'abort' } | { type: 'ack'; sequence: number };

export type PageStreamControlMessage = { type: 'abort' } | { type: 'ack'; sequence: number };

export type StreamWorkerMessage =
	| { type: 'response'; status: number; statusText: string; contentLength: string | null }
	| { type: 'chunk'; sequence: number; data: string }
	| { type: 'done' }
	| { type: 'error'; message: string };

export type PageStreamMessage =
	| { type: 'response'; status: number; statusText: string; contentLength: string | null }
	| { type: 'chunk'; sequence: number; buffer: ArrayBuffer }
	| { type: 'done' }
	| { type: 'error'; message: string };

const AKAMAI_STREAM_HOSTS = new Set(['upos-hz-mirrorakam.akamaized.net', 'upos-sz-mirrorakam.akamaized.net']);

export function isAllowedStreamUrl(value: string): boolean {
	try {
		const url = new URL(value);
		const hostname = url.hostname.toLowerCase();
		const isBilibiliCdn = /^upos-[a-z0-9-]+\.bilivideo\.com$/.test(hostname) || AKAMAI_STREAM_HOSTS.has(hostname);
		return (
			url.protocol === 'https:' &&
			!url.username &&
			!url.password &&
			(url.port === '' || url.port === '443') &&
			isBilibiliCdn &&
			/\.(?:m4s|mp4|flv)$/i.test(url.pathname)
		);
	} catch {
		return false;
	}
}

export function isBilibiliPageUrl(value: string | undefined): boolean {
	if (!value) return false;
	try {
		const url = new URL(value);
		const hostname = url.hostname.toLowerCase();
		return (
			(url.protocol === 'https:' || url.protocol === 'http:') &&
			(hostname === 'www.bilibili.com' || hostname === 'bilibili.com')
		);
	} catch {
		return false;
	}
}

export function isPageStreamFetchRequest(value: unknown): value is PageStreamFetchRequest {
	if (!value || typeof value !== 'object') return false;
	const request = value as Partial<PageStreamFetchRequest>;
	return (
		request.source === STREAM_FETCH_SOURCE &&
		request.type === 'request' &&
		request.requestType === STREAM_FETCH_REQUEST_TYPE &&
		typeof request.url === 'string'
	);
}

function isSequence(value: unknown): value is number {
	return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function isPageStreamControlMessage(value: unknown): value is PageStreamControlMessage {
	if (!value || typeof value !== 'object') return false;
	const message = value as Partial<PageStreamControlMessage>;
	return message.type === 'abort' || (message.type === 'ack' && isSequence(message.sequence));
}

export function isStreamWorkerRequest(value: unknown): value is StreamWorkerRequest {
	if (!value || typeof value !== 'object') return false;
	const message = value as Partial<StreamWorkerRequest>;
	return (message.type === 'fetch' && typeof message.url === 'string') || isPageStreamControlMessage(value);
}

export function isStreamWorkerMessage(value: unknown): value is StreamWorkerMessage {
	if (!value || typeof value !== 'object') return false;
	const message = value as Partial<StreamWorkerMessage>;
	switch (message.type) {
		case 'response':
			return (
				Number.isInteger(message.status) &&
				typeof message.statusText === 'string' &&
				(message.contentLength === null || typeof message.contentLength === 'string')
			);
		case 'chunk':
			return isSequence(message.sequence) && typeof message.data === 'string';
		case 'done':
			return true;
		case 'error':
			return typeof message.message === 'string';
		default:
			return false;
	}
}

export function isPageStreamMessage(value: unknown): value is PageStreamMessage {
	if (!value || typeof value !== 'object') return false;
	const message = value as Partial<PageStreamMessage>;
	switch (message.type) {
		case 'response':
			return (
				Number.isInteger(message.status) &&
				typeof message.statusText === 'string' &&
				(message.contentLength === null || typeof message.contentLength === 'string')
			);
		case 'chunk':
			return isSequence(message.sequence) && message.buffer instanceof ArrayBuffer;
		case 'done':
			return true;
		case 'error':
			return typeof message.message === 'string';
		default:
			return false;
	}
}

export function encodeBase64(bytes: Uint8Array): string {
	let binary = '';
	for (let offset = 0; offset < bytes.length; offset += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
	}
	return btoa(binary);
}

export function decodeBase64(value: string): ArrayBuffer {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}

export function decodeStreamWorkerChunk(
	message: Extract<StreamWorkerMessage, { type: 'chunk' }>
): Extract<PageStreamMessage, { type: 'chunk' }> {
	return {
		type: 'chunk',
		sequence: message.sequence,
		buffer: decodeBase64(message.data)
	};
}
