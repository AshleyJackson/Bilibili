import { STREAM_FETCH_DEFAULTS } from './constants';
import { logInfo, logWarn, logError, logFetch } from './logger';
import { fileToUint8Array } from './utils';

const MODULE = 'fetch';

/**
 * Fetch a URL and return its contents as an ArrayBuffer.
 * Supports progress callbacks via streaming.
 */
export async function fetchWithProgress(
	url: string,
	onProgress?: (info: { url: string; total: number; received: number; delta: number; done: boolean }) => void
): Promise<ArrayBuffer> {
	const response = await fetch(url, STREAM_FETCH_DEFAULTS);
	let result: ArrayBuffer;

	try {
		const contentLength = parseInt(response.headers.get('Content-Length') ?? '-1', 10);
		if (contentLength > 0) {
			logInfo(MODULE, 'fetchWithProgress: streaming', { url: url.slice(0, 80), contentLength });
		}
		const reader = response.body?.getReader();
		if (!reader) throw new Error('failed to get response body reader');

		const chunks: Uint8Array[] = [];
		let received = 0;

		for (;;) {
			const { done, value } = await reader.read();
			const delta = value ? value.length : 0;
			if (done) {
				if (contentLength !== -1 && contentLength !== received) {
					throw new Error('failed to complete download');
				}
				onProgress?.({ url, total: contentLength, received, delta, done: true });
				break;
			}
			chunks.push(value);
			received += delta;
			onProgress?.({ url, total: contentLength, received, delta, done: false });
		}

		const merged = new Uint8Array(received);
		let offset = 0;
		for (const chunk of chunks) {
			merged.set(chunk, offset);
			offset += chunk.length;
		}
		result = merged.buffer;
	} catch (err) {
		// Fallback to non-streaming fetch
		logWarn(MODULE, 'streaming failed, falling back to arrayBuffer', err);
		result = await response.arrayBuffer();
		onProgress?.({ url, total: result.byteLength, received: result.byteLength, delta: 0, done: true });
	}

	return result;
}

/**
 * Fetch and return as a Blob, optionally streaming with progress.
 */
export async function fetchAsBlob(
	url: string,
	mimeType: string,
	streaming = false,
	onProgress?: (info: { url: string; total: number; received: number; delta: number; done: boolean }) => void
): Promise<string> {
	logInfo(MODULE, 'fetchAsBlob', { url: url.slice(0, 80), mimeType, streaming });
	const data = streaming
		? await fetchWithProgress(url, onProgress)
		: await (await fetch(url, STREAM_FETCH_DEFAULTS)).arrayBuffer();
	const blob = new Blob([data], { type: mimeType });
	const blobUrl = URL.createObjectURL(blob);
	logInfo(MODULE, 'fetchAsBlob: blob created', { blobUrl: blobUrl.slice(0, 40), size: data.byteLength });
	return blobUrl;
}

/**
 * Stream a download with progress updates and return the Blob.
 */
export async function streamDownload(
	url: string,
	expectedSize: number | null,
	onProgress: (received: number, total: number) => void
): Promise<Blob> {
	logInfo(MODULE, 'streamDownload: start', { url: url.slice(0, 80), expectedSize });
	const response = await window.fetch(url, STREAM_FETCH_DEFAULTS);
	if (!response.ok) {
		logError(MODULE, 'streamDownload: HTTP error', { url: url.slice(0, 80), status: response.status, statusText: response.statusText });
		throw new Error(`HTTP ${response.status} ${response.statusText}`);
	}
	const contentLength = expectedSize ?? parseInt(response.headers.get('content-length') ?? '0', 10);
	let received = 0;

	const reader = response.body!.getReader();

	const buffer = await new Response(
		new ReadableStream({
			start(controller) {
				const pump = (): void => {
					reader
						.read()
						.then(({ done, value }) => {
							if (done) {
								controller.close();
								return;
							}
							received += value.byteLength;
							onProgress(received, contentLength);
							controller.enqueue(value);
							pump();
						})
						.catch((err) => controller.error(err));
				};
				pump();
			}
		})
	).arrayBuffer();
	const blob = new Blob([buffer]);
	logInfo(MODULE, 'streamDownload: complete', { url: url.slice(0, 80), received, blobSize: blob.size });
	return blob;
}

/**
 * Convert various input types to Uint8Array.
 */
export async function toUint8Array(input: string | URL | File | Blob): Promise<Uint8Array> {
	if (typeof input === 'string') {
		const match = /data:([a-zA-Z]+\/[a-zA-Z0-9.+-]+);base64,(.*)/.exec(input);
		if (match) {
			const binary = atob(match[2]);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			logInfo(MODULE, 'toUint8Array: decoded base64 data URI', { size: bytes.length });
			return bytes;
		}
		const done = logFetch(MODULE, input.slice(0, 120), 'GET');
		let response: Response;
		try {
			response = await fetch(input, STREAM_FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			throw err;
		}
		done(response);
		const buf = await response.arrayBuffer();
		logInfo(MODULE, 'toUint8Array: fetched', { size: buf.byteLength });
		return new Uint8Array(buf);
	}
	if (input instanceof URL) {
		const done = logFetch(MODULE, input.toString(), 'GET');
		let response: Response;
		try {
			response = await fetch(input, STREAM_FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			throw err;
		}
		done(response);
		const buf = await response.arrayBuffer();
		logInfo(MODULE, 'toUint8Array: fetched URL', { size: buf.byteLength });
		return new Uint8Array(buf);
	}
	logInfo(MODULE, 'toUint8Array: reading File/Blob', { type: input.type, size: input.size });
	return fileToUint8Array(input);
}
