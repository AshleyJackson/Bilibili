import {
	isAllowedStreamUrl,
	isPageStreamMessage,
	STREAM_FETCH_REQUEST_TYPE,
	STREAM_FETCH_SOURCE
} from './stream-download-protocol';

const RESPONSE_TIMEOUT_MS = 15_000;

function abortError(): DOMException {
	return new DOMException('The operation was aborted', 'AbortError');
}

/**
 * Request a CDN response through the isolated content script and extension
 * service worker. Page-world fetch is subject to Bilibili's CORS policy.
 */
export function fetchStreamThroughExtension(url: string, signal?: AbortSignal): Promise<Response> {
	if (!isAllowedStreamUrl(url)) {
		return Promise.reject(new Error('Unsupported Bilibili stream URL'));
	}
	if (signal?.aborted) return Promise.reject(abortError());

	return new Promise<Response>((resolve, reject) => {
		const channel = new MessageChannel();
		let responseReceived = false;
		let settled = false;
		let streamController: ReadableStreamDefaultController<Uint8Array> | undefined;
		let pendingAcknowledgement: number | undefined;
		let responseTimer: ReturnType<typeof setTimeout>;

		const cleanup = (): void => {
			clearTimeout(responseTimer);
			signal?.removeEventListener('abort', onAbort);
			channel.port1.onmessage = null;
			channel.port1.onmessageerror = null;
			channel.port1.close();
		};

		const sendAbort = (): void => {
			try {
				channel.port1.postMessage({ type: 'abort' });
			} catch {
				// The bridge may already be closed.
			}
		};

		const fail = (error: Error): void => {
			if (settled) return;
			sendAbort();
			settled = true;
			if (responseReceived) {
				try {
					streamController?.error(error);
				} catch {
					// The consumer may already have canceled its reader.
				}
			} else {
				reject(error);
			}
			cleanup();
		};

		const onAbort = (): void => {
			fail(abortError());
		};

		const body = new ReadableStream<Uint8Array>(
			{
				start(controller) {
					streamController = controller;
				},
				pull() {
					if (pendingAcknowledgement === undefined) return;
					const sequence = pendingAcknowledgement;
					pendingAcknowledgement = undefined;
					try {
						channel.port1.postMessage({ type: 'ack', sequence });
					} catch (error) {
						fail(error instanceof Error ? error : new Error(String(error)));
					}
				},
				cancel() {
					if (settled) return;
					sendAbort();
					settled = true;
					cleanup();
				}
			},
			{ highWaterMark: 1 }
		);

		responseTimer = setTimeout(() => {
			fail(new Error('Timed out waiting for the extension stream worker'));
		}, RESPONSE_TIMEOUT_MS);

		channel.port1.onmessage = (event: MessageEvent<unknown>): void => {
			if (!isPageStreamMessage(event.data)) {
				fail(new Error('Invalid response from the extension stream worker'));
				return;
			}

			const message = event.data;
			if (message.type === 'response') {
				if (responseReceived || settled) {
					fail(new Error('Duplicate response from the extension stream worker'));
					return;
				}
				try {
					const headers = new Headers();
					if (message.contentLength && /^\d+$/.test(message.contentLength)) {
						headers.set('content-length', message.contentLength);
					}
					const responseBody = message.status === 204 || message.status === 205 || message.status === 304 ? null : body;
					const response = new Response(responseBody, {
						status: message.status,
						statusText: message.statusText,
						headers
					});
					responseReceived = true;
					clearTimeout(responseTimer);
					resolve(response);
				} catch (error) {
					fail(error instanceof Error ? error : new Error(String(error)));
				}
				return;
			}

			if (message.type === 'chunk') {
				if (!responseReceived || settled) {
					fail(new Error('Received stream data before response headers'));
					return;
				}
				if (pendingAcknowledgement !== undefined) {
					fail(new Error('Received a stream chunk before acknowledging the previous chunk'));
					return;
				}
				try {
					const buffer = message.buffer;
					if (!(buffer instanceof ArrayBuffer)) {
						fail(new Error('Invalid stream chunk from extension worker'));
						return;
					}
					pendingAcknowledgement = message.sequence;
					streamController?.enqueue(new Uint8Array(buffer));
				} catch (error) {
					fail(error instanceof Error ? error : new Error(String(error)));
				}
				return;
			}

			if (message.type === 'done') {
				if (!responseReceived) {
					fail(new Error('Stream ended before response headers'));
					return;
				}
				if (pendingAcknowledgement !== undefined) {
					fail(new Error('Stream ended before the last chunk was acknowledged'));
					return;
				}
				if (!settled) {
					settled = true;
					try {
						streamController?.close();
					} catch {
						// The consumer may already have canceled its reader.
					}
					cleanup();
				}
				return;
			}

			fail(new Error(message.message || 'Extension stream request failed'));
		};

		channel.port1.onmessageerror = (): void => {
			fail(new Error('Could not read a message from the extension stream worker'));
		};
		channel.port1.start();
		signal?.addEventListener('abort', onAbort, { once: true });

		try {
			window.postMessage(
				{
					source: STREAM_FETCH_SOURCE,
					type: 'request',
					url,
					requestType: STREAM_FETCH_REQUEST_TYPE
				},
				window.location.origin,
				[channel.port2]
			);
		} catch (error) {
			fail(error instanceof Error ? error : new Error(String(error)));
		}
	});
}
