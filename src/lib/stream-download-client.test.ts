// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchStreamThroughExtension } from './stream-download-client';

class FakeMessagePort {
	onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
	onmessageerror: (() => void) | null = null;
	peer?: FakeMessagePort;
	closed = false;

	postMessage(data: unknown): void {
		this.peer?.onmessage?.({ data } as MessageEvent<unknown>);
	}

	start(): void {}

	close(): void {
		this.closed = true;
	}
}

class FakeMessageChannel {
	port1 = new FakeMessagePort();
	port2 = new FakeMessagePort();

	constructor() {
		this.port1.peer = this.port2;
		this.port2.peer = this.port1;
	}
}

describe('fetchStreamThroughExtension', () => {
	const channels: FakeMessageChannel[] = [];

	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		channels.length = 0;
		vi.stubGlobal(
			'MessageChannel',
			class extends FakeMessageChannel {
				constructor() {
					super();
					channels.push(this);
				}
			}
		);
		vi.spyOn(window, 'postMessage').mockImplementation(((
			message: unknown,
			_targetOrigin: string,
			transfer: Transferable[]
		) => {
			const request = message as { source?: string; type?: string; url?: string };
			expect(request.source).toBe('bilibili-helper-stream-fetch');
			expect(request.type).toBe('request');
			expect(request.url).toBe('https://upos-sz-mirror.bilivideo.com/video.m4s');
			const workerPort = transfer[0] as unknown as FakeMessagePort;
			workerPort.postMessage({
				type: 'response',
				status: 206,
				statusText: 'Partial Content',
				contentLength: '4'
			});
			workerPort.postMessage({ type: 'chunk', buffer: new Uint8Array([1, 2]).buffer });
			workerPort.postMessage({ type: 'chunk', buffer: new Uint8Array([3, 4]).buffer });
			workerPort.postMessage({ type: 'done' });
		}) as typeof window.postMessage);
	});

	it('reconstructs a streaming Response from worker messages', async () => {
		const response = await fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s');

		expect(response.status).toBe(206);
		expect(response.headers.get('content-length')).toBe('4');
		expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3, 4]));
		expect(channels).toHaveLength(1);
	});

	it('rejects unsupported hosts without opening a bridge', async () => {
		await expect(fetchStreamThroughExtension('https://example.com/video.m4s')).rejects.toThrow(
			'Unsupported Bilibili stream URL'
		);
		expect(window.postMessage).not.toHaveBeenCalled();
		expect(channels).toHaveLength(0);
	});

	it('forwards abort signals to the isolated content script', async () => {
		const abortHandler = vi.fn();
		vi.mocked(window.postMessage).mockImplementation(((
			_message: unknown,
			_targetOrigin: string,
			transfer: Transferable[]
		) => {
			const workerPort = transfer[0] as unknown as FakeMessagePort;
			workerPort.onmessage = abortHandler;
		}) as typeof window.postMessage);
		const controller = new AbortController();
		const pending = fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s', controller.signal);

		controller.abort();

		await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
		expect(abortHandler).toHaveBeenCalledWith({ data: { type: 'abort' } });
	});
});
