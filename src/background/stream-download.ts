import { STREAM_FETCH_DEFAULTS } from '../lib/constants';
import {
	encodeBase64,
	isAllowedStreamUrl,
	isBilibiliPageUrl,
	STREAM_FETCH_PORT_NAME,
	type StreamWorkerMessage,
	type StreamWorkerRequest
} from '../lib/stream-download-protocol';

const CHUNK_SIZE = 64 * 1024;

function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function isRequest(value: unknown): value is StreamWorkerRequest {
	if (!value || typeof value !== 'object') return false;
	const message = value as Partial<StreamWorkerRequest>;
	return message.type === 'abort' || (message.type === 'fetch' && typeof message.url === 'string');
}

function isAuthorizedSender(port: chrome.runtime.Port, extensionId: string): boolean {
	return port.sender?.id === extensionId && port.sender.frameId === 0 && isBilibiliPageUrl(port.sender.url);
}

/**
 * Handle one stream request from the Bilibili page's isolated content script.
 * The port is scoped to a single request and only permits Bilibili CDN hosts.
 */
export function attachStreamDownloadPort(
	port: chrome.runtime.Port,
	extensionId: string,
	fetchImpl: typeof fetch = fetch
): void {
	if (port.name !== STREAM_FETCH_PORT_NAME) return;
	if (!isAuthorizedSender(port, extensionId)) {
		port.disconnect();
		return;
	}

	const controller = new AbortController();
	let started = false;
	let finished = false;

	const send = (message: StreamWorkerMessage): boolean => {
		if (finished) return false;
		try {
			port.postMessage(message);
			return true;
		} catch {
			controller.abort();
			finished = true;
			return false;
		}
	};

	const finish = (message: StreamWorkerMessage): void => {
		if (finished) return;
		finished = true;
		try {
			port.postMessage(message);
		} catch {
			// The receiving content script has already disconnected.
		}
		port.disconnect();
	};

	const sendError = (error: unknown): void => {
		finish({ type: 'error', message: errorMessage(error) });
	};

	const streamResponse = async (url: string): Promise<void> => {
		try {
			const response = await fetchImpl(url, {
				...STREAM_FETCH_DEFAULTS,
				signal: controller.signal
			});
			if (
				!send({
					type: 'response',
					status: response.status,
					statusText: response.statusText,
					contentLength: response.headers.get('content-length')
				})
			) {
				return;
			}

			if (!response.ok) {
				finish({ type: 'done' });
				return;
			}

			const sendBytes = (bytes: Uint8Array): boolean => {
				for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
					if (controller.signal.aborted) return false;
					const data = encodeBase64(bytes.subarray(offset, offset + CHUNK_SIZE));
					if (!send({ type: 'chunk', data })) return false;
				}
				return true;
			};

			if (!response.body) {
				const bytes = new Uint8Array(await response.arrayBuffer());
				if (!sendBytes(bytes)) return;
				finish({ type: 'done' });
				return;
			}

			const reader = response.body.getReader();
			try {
				for (;;) {
					const result = await reader.read();
					if (result.done) break;
					if (!sendBytes(result.value)) {
						await reader.cancel();
						return;
					}
				}
			} finally {
				reader.releaseLock();
			}
			finish({ type: 'done' });
		} catch (error) {
			if (!controller.signal.aborted) sendError(error);
			else finish({ type: 'error', message: 'Download aborted' });
		}
	};

	port.onDisconnect.addListener(() => {
		controller.abort();
		finished = true;
	});

	port.onMessage.addListener((rawMessage: unknown) => {
		if (!isRequest(rawMessage)) {
			sendError(new Error('Invalid stream request'));
			return;
		}
		if (rawMessage.type === 'abort') {
			controller.abort();
			return;
		}
		if (started) {
			sendError(new Error('A stream request is already active on this port'));
			return;
		}
		if (!isAllowedStreamUrl(rawMessage.url)) {
			sendError(new Error('Unsupported Bilibili stream URL'));
			return;
		}
		started = true;
		void streamResponse(rawMessage.url);
	});
}
