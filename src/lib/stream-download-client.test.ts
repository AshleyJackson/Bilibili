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
			workerPort.onmessage = (event) => {
				const message = event.data as { type?: string; sequence?: number };
				if (message.type === 'ack' && message.sequence === 0) {
					workerPort.postMessage({ type: 'chunk', sequence: 1, buffer: new Uint8Array([3, 4]).buffer });
				} else if (message.type === 'ack' && message.sequence === 1) {
					workerPort.postMessage({ type: 'done' });
				}
			};
			workerPort.postMessage({
				type: 'response',
				status: 206,
				statusText: 'Partial Content',
				contentLength: '4'
			});
			workerPort.postMessage({ type: 'chunk', sequence: 0, buffer: new Uint8Array([1, 2]).buffer });
		}) as typeof window.postMessage);
	});

	it('reconstructs a streaming Response from worker messages', async () => {
		const response = await fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s');

		expect(response.status).toBe(206);
		expect(response.headers.get('content-length')).toBe('4');
		expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3, 4]));
		expect(channels).toHaveLength(1);
	});

	it('acknowledges chunks only after the response body reader consumes them', async () => {
		const pageMessages: unknown[] = [];
		let acknowledge!: (message: unknown) => void;
		const acknowledgement = new Promise<unknown>((resolve) => {
			acknowledge = resolve;
		});
		vi.mocked(window.postMessage).mockImplementation(((
			_message: unknown,
			_targetOrigin: string,
			transfer: Transferable[]
		) => {
			const workerPort = transfer[0] as unknown as FakeMessagePort;
			workerPort.onmessage = (event) => {
				pageMessages.push(event.data);
				acknowledge(event.data);
			};
			workerPort.postMessage({
				type: 'response',
				status: 206,
				statusText: 'Partial Content',
				contentLength: '2'
			});
			workerPort.postMessage({ type: 'chunk', sequence: 0, buffer: new Uint8Array([1, 2]).buffer });
		}) as typeof window.postMessage);

		const response = await fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s');
		expect(pageMessages).toEqual([]);

		const reader = response.body!.getReader();
		await expect(reader.read()).resolves.toMatchObject({ done: false, value: new Uint8Array([1, 2]) });
		await expect(acknowledgement).resolves.toEqual({ type: 'ack', sequence: 0 });
		expect(pageMessages).toEqual([{ type: 'ack', sequence: 0 }]);
	});

	it('rejects unsupported hosts without opening a bridge', async () => {
		await expect(fetchStreamThroughExtension('https://example.com/video.m4s')).rejects.toThrow(
			'Unsupported Bilibili stream URL'
		);
		expect(window.postMessage).not.toHaveBeenCalled();
		expect(channels).toHaveLength(0);
	});

	it('rejects a message channel without a usable postMessage method', async () => {
		vi.stubGlobal(
			'MessageChannel',
			class extends FakeMessageChannel {
				constructor() {
					super();
					Object.defineProperty(this.port1, 'postMessage', { value: null });
					channels.push(this);
				}
			}
		);

		await expect(fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s')).rejects.toThrow(
			'The extension stream message channel is unavailable'
		);
		expect(channels[0].port1.closed).toBe(true);
		expect(channels[0].port2.closed).toBe(true);
		expect(window.postMessage).not.toHaveBeenCalled();
	});

	it('reports unavailable page messaging without throwing a null postMessage TypeError', async () => {
		const descriptor = Object.getOwnPropertyDescriptor(window, 'postMessage');
		Object.defineProperty(window, 'postMessage', { configurable: true, value: null });

		try {
			await expect(fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s')).rejects.toThrow(
				'Page messaging is unavailable'
			);
			expect(channels[0].port1.closed).toBe(true);
		} finally {
			if (descriptor) Object.defineProperty(window, 'postMessage', descriptor);
		}
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

	it('aborts the worker request when response headers time out', async () => {
		vi.useFakeTimers();
		try {
			const workerMessages: unknown[] = [];
			vi.mocked(window.postMessage).mockImplementation(((
				_message: unknown,
				_targetOrigin: string,
				transfer: Transferable[]
			) => {
				const workerPort = transfer[0] as unknown as FakeMessagePort;
				workerPort.onmessage = (event) => workerMessages.push(event.data);
			}) as typeof window.postMessage);

			const pending = fetchStreamThroughExtension('https://upos-sz-mirror.bilivideo.com/video.m4s');
			const rejection = expect(pending).rejects.toThrow('Timed out waiting for the extension stream worker');
			await vi.advanceTimersByTimeAsync(15_000);
			await rejection;

			expect(workerMessages).toEqual([{ type: 'abort' }]);
			expect(channels[0].port1.closed).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});
});
