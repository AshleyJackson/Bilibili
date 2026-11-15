import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachStreamDownloadPort } from './stream-download';
import { decodeBase64, STREAM_FETCH_PORT_NAME } from '../lib/stream-download-protocol';

class FakeRuntimePort {
	name = STREAM_FETCH_PORT_NAME;
	sender: chrome.runtime.MessageSender = {
		id: 'extension-id',
		url: 'https://www.bilibili.com/en/video/BV123',
		frameId: 0
	};
	messages: unknown[] = [];
	disconnected = false;
	private messageListeners: ((message: unknown) => void)[] = [];
	private disconnectListeners: (() => void)[] = [];

	onMessage = {
		addListener: (listener: (message: unknown) => void): void => {
			this.messageListeners.push(listener);
		}
	};

	onDisconnect = {
		addListener: (listener: () => void): void => {
			this.disconnectListeners.push(listener);
		}
	};

	postMessage(message: unknown): void {
		this.messages.push(message);
	}

	disconnect(): void {
		this.disconnected = true;
		this.disconnectListeners.forEach((listener) => listener());
	}

	send(message: unknown): void {
		this.messageListeners.forEach((listener) => listener(message));
	}
}

function workerMessages(port: FakeRuntimePort): Record<string, unknown>[] {
	return port.messages as Record<string, unknown>[];
}

describe('attachStreamDownloadPort', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('streams authorized CDN responses in bounded chunks', async () => {
		const port = new FakeRuntimePort();
		const firstPayload = new Uint8Array(64 * 1024 + 3);
		firstPayload.set([1, 2, 3], firstPayload.length - 3);
		const secondPayload = new Uint8Array([4, 5]);
		const expectedPayload = new Uint8Array(firstPayload.length + secondPayload.length);
		expectedPayload.set(firstPayload);
		expectedPayload.set(secondPayload, firstPayload.length);
		let pullCount = 0;
		const responseBody = new ReadableStream<Uint8Array>(
			{
				pull(controller) {
					if (pullCount === 0) controller.enqueue(firstPayload);
					else if (pullCount === 1) controller.enqueue(secondPayload);
					else controller.close();
					pullCount++;
				}
			},
			{ highWaterMark: 0 }
		);
		const fetchMock = vi.fn(
			async () =>
				new Response(responseBody, {
					status: 206,
					statusText: 'Partial Content',
					headers: { 'content-length': String(expectedPayload.length) }
				})
		);

		attachStreamDownloadPort(
			port as unknown as chrome.runtime.Port,
			'extension-id',
			fetchMock as unknown as typeof fetch
		);
		port.send({
			type: 'fetch',
			url: 'https://upos-sz-mirror.bilivideo.com/video.m4s?sign=test'
		});

		const waitForMessages = () => new Promise((resolve) => setTimeout(resolve, 10));
		await waitForMessages();
		const messages = workerMessages(port);
		const response = messages.find((message) => message.type === 'response');
		const chunks = () => workerMessages(port).filter((message) => message.type === 'chunk');
		expect(response).toMatchObject({ status: 206, contentLength: String(expectedPayload.length) });
		expect(chunks()).toHaveLength(1);
		expect(pullCount).toBe(1);

		port.send({ type: 'ack', sequence: 0 });
		await waitForMessages();
		expect(chunks()).toHaveLength(2);
		expect(pullCount).toBe(1);

		port.send({ type: 'ack', sequence: 1 });
		await waitForMessages();
		expect(chunks()).toHaveLength(3);
		expect(pullCount).toBe(2);

		port.send({ type: 'ack', sequence: 2 });
		await waitForMessages();
		const received = chunks().flatMap((message) => Array.from(new Uint8Array(decodeBase64(String(message.data)))));
		expect(new Uint8Array(received)).toEqual(expectedPayload);
		expect(messages.at(-1)).toEqual({ type: 'done' });
		expect(port.disconnected).toBe(true);
		expect(pullCount).toBe(3);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://upos-sz-mirror.bilivideo.com/video.m4s?sign=test',
			expect.objectContaining({
				credentials: 'include',
				referrer: 'https://www.bilibili.com/'
			})
		);
	});

	it('rejects a forged sender before accepting a request', () => {
		const port = new FakeRuntimePort();
		port.sender.id = 'other-extension';
		const fetchMock = vi.fn();

		attachStreamDownloadPort(
			port as unknown as chrome.runtime.Port,
			'extension-id',
			fetchMock as unknown as typeof fetch
		);

		expect(port.disconnected).toBe(true);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects non-CDN URLs without fetching them', async () => {
		const port = new FakeRuntimePort();
		const fetchMock = vi.fn();
		attachStreamDownloadPort(
			port as unknown as chrome.runtime.Port,
			'extension-id',
			fetchMock as unknown as typeof fetch
		);
		port.send({ type: 'fetch', url: 'https://example.com/video.m4s' });

		expect(workerMessages(port)).toContainEqual({
			type: 'error',
			message: 'Unsupported Bilibili stream URL'
		});
		expect(fetchMock).not.toHaveBeenCalled();
		expect(port.disconnected).toBe(true);
	});
});
