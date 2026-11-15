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
		const payload = new Uint8Array(64 * 1024 + 3);
		payload.set([1, 2, 3], payload.length - 3);
		const fetchMock = vi.fn(
			async () =>
				new Response(payload, {
					status: 206,
					statusText: 'Partial Content',
					headers: { 'content-length': String(payload.length) }
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

		await new Promise((resolve) => setTimeout(resolve, 10));
		const messages = workerMessages(port);
		const response = messages.find((message) => message.type === 'response');
		const chunks = messages.filter((message) => message.type === 'chunk');
		expect(response).toMatchObject({ status: 206, contentLength: String(payload.length) });
		expect(chunks).toHaveLength(2);
		const received = chunks.flatMap((message) => Array.from(new Uint8Array(decodeBase64(String(message.data)))));
		expect(new Uint8Array(received)).toEqual(payload);
		expect(messages.at(-1)).toEqual({ type: 'done' });
		expect(port.disconnected).toBe(true);
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
