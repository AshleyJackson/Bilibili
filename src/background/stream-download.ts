import { STREAM_FETCH_DEFAULTS } from '../lib/constants';
import {
	encodeBase64,
	isAllowedStreamUrl,
	isBilibiliPageUrl,
	isStreamWorkerRequest,
	STREAM_FETCH_PORT_NAME,
	type StreamWorkerMessage
} from '../lib/stream-download-protocol';

const CHUNK_SIZE = 64 * 1024;

function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
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
	fetchImpl: typeof fetch = fetch,
	refererRuleReady: Promise<boolean> = Promise.resolve(true)
): void {
	if (port.name !== STREAM_FETCH_PORT_NAME) return;
	if (!isAuthorizedSender(port, extensionId)) {
		port.disconnect();
		return;
	}

	const controller = new AbortController();
	let started = false;
	let finished = false;
	let nextSequence = 0;
	let pendingAcknowledgement: { sequence: number; resolve: (acknowledged: boolean) => void } | undefined;

	controller.signal.addEventListener(
		'abort',
		() => {
			const pending = pendingAcknowledgement;
			pendingAcknowledgement = undefined;
			pending?.resolve(false);
		},
		{ once: true }
	);

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
			if (!(await refererRuleReady)) {
				throw new Error('Could not configure the Bilibili CDN Referer header');
			}
			if (controller.signal.aborted) {
				finish({ type: 'error', message: 'Download aborted' });
				return;
			}
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

			const sendBytes = async (bytes: Uint8Array): Promise<boolean> => {
				for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
					if (controller.signal.aborted) return false;
					const sequence = nextSequence++;
					let resolveAcknowledgement!: (acknowledged: boolean) => void;
					const acknowledgement = new Promise<boolean>((resolve) => {
						resolveAcknowledgement = resolve;
						pendingAcknowledgement = { sequence, resolve };
					});
					const data = encodeBase64(bytes.subarray(offset, offset + CHUNK_SIZE));
					if (!send({ type: 'chunk', sequence, data })) {
						if (pendingAcknowledgement?.sequence === sequence) {
							pendingAcknowledgement = undefined;
							resolveAcknowledgement(false);
						}
						return false;
					}
					if (!(await acknowledgement) || controller.signal.aborted) return false;
				}
				return true;
			};

			if (!response.body) {
				const bytes = new Uint8Array(await response.arrayBuffer());
				if (!(await sendBytes(bytes))) {
					if (controller.signal.aborted) finish({ type: 'error', message: 'Download aborted' });
					return;
				}
				finish({ type: 'done' });
				return;
			}

			const reader = response.body.getReader();
			try {
				for (;;) {
					const result = await reader.read();
					if (result.done) break;
					if (!(await sendBytes(result.value))) {
						await reader.cancel();
						if (controller.signal.aborted) finish({ type: 'error', message: 'Download aborted' });
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
		if (!isStreamWorkerRequest(rawMessage)) {
			sendError(new Error('Invalid stream request'));
			return;
		}
		if (rawMessage.type === 'abort') {
			controller.abort();
			if (!started) finish({ type: 'error', message: 'Download aborted' });
			return;
		}
		if (rawMessage.type === 'ack') {
			if (!started || pendingAcknowledgement?.sequence !== rawMessage.sequence) {
				sendError(new Error('Unexpected stream chunk acknowledgement'));
				return;
			}
			const pending = pendingAcknowledgement;
			pendingAcknowledgement = undefined;
			pending.resolve(true);
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
