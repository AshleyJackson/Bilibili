import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	createSentryErrorMessage,
	dispatchContentScriptError,
	forwardSentryErrorMessage,
	isSentryErrorMessage,
	reportErrorToSentry,
	sanitizeSentryEvent,
	serializeSentryError,
	SENTRY_ERROR_MESSAGE_TYPE
} from './sentry-reporting';

describe('serializeSentryError', () => {
	it('keeps the error name, message, and stack', () => {
		const error = new TypeError('request failed');
		const result = serializeSentryError(error);

		expect(result).toEqual({
			name: 'TypeError',
			message: 'request failed',
			stack: error.stack
		});
	});

	it('limits oversized error fields', () => {
		const result = serializeSentryError(new Error('m'.repeat(3_000)));

		expect(result.message).toHaveLength(2_000);
		expect(result.stack!.length).toBeLessThanOrEqual(12_000);
	});
});

describe('Sentry message validation and forwarding', () => {
	it('builds a compact, validated message', () => {
		const message = createSentryErrorMessage(new Error('failed'), 'content-script', 'api.fetch');

		expect(message.type).toBe(SENTRY_ERROR_MESSAGE_TYPE);
		expect(message.source).toBe('content-script');
		expect(message.module).toBe('api.fetch');
		expect(isSentryErrorMessage(message)).toBe(true);
		expect(
			isSentryErrorMessage({
				...message,
				module: 'contains user-provided data'
			})
		).toBe(false);
	});

	it('dispatches page-world errors as a custom event', () => {
		const dispatchEvent = vi.fn();
		vi.stubGlobal('window', { dispatchEvent });

		dispatchContentScriptError(new Error('download failed'), 'download');

		expect(dispatchEvent).toHaveBeenCalledOnce();
		expect(dispatchEvent.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
		expect(dispatchEvent.mock.calls[0][0].detail.error.message).toBe('download failed');
	});

	it('forwards only valid reports to the extension service worker', async () => {
		const sendMessage = vi.fn(() => Promise.resolve({ sent: true }));
		vi.stubGlobal('chrome', { runtime: { id: 'extension-id', sendMessage } });
		const message = createSentryErrorMessage('reported', 'extension-popup');

		await expect(forwardSentryErrorMessage(message)).resolves.toBe(true);
		await expect(forwardSentryErrorMessage({ ...message, source: 'website' })).resolves.toBe(false);

		expect(sendMessage).toHaveBeenCalledOnce();
		expect(sendMessage).toHaveBeenCalledWith(message);
	});

	it('does not let reporting errors escape into extension code', async () => {
		vi.stubGlobal('chrome', {
			runtime: {
				id: 'extension-id',
				sendMessage: () => {
					throw new Error('runtime unavailable');
				}
			}
		});

		await expect(reportErrorToSentry('failure', 'extension-popup')).resolves.toBe(false);
	});

	it('returns false when the Chrome extension runtime is unavailable', async () => {
		vi.stubGlobal('chrome', undefined);

		await expect(reportErrorToSentry('failure', 'extension-popup')).resolves.toBe(false);
	});
});

describe('sanitizeSentryEvent', () => {
	it('removes request and user data and redacts page URLs', () => {
		const event = {
			message: 'Failed at https://www.bilibili.com/video/BV123?token=secret',
			request: { url: 'https://www.bilibili.com/video/BV123?token=secret' },
			user: { ip_address: '127.0.0.1' },
			extra: { videoTitle: 'private title' },
			breadcrumbs: [{ message: 'visited video' }],
			exception: {
				values: [
					{
						value: 'Fetch failed: https://api.bilibili.com/x/player',
						stacktrace: {
							frames: [
								{
									filename: 'https://www.bilibili.com/video/BV123?token=secret',
									abs_path: 'https://www.bilibili.com/video/BV123?token=secret',
									vars: { title: 'private title' }
								},
								{
									filename: 'chrome-extension://abc/bilibili-helper-content-script.js',
									vars: { token: 'private' }
								}
							]
						}
					}
				]
			}
		};

		sanitizeSentryEvent(event);

		expect(event.request).toBeUndefined();
		expect(event.user).toBeUndefined();
		expect(event.extra).toBeUndefined();
		expect(event.breadcrumbs).toEqual([]);
		expect(event.message).toContain('[external URL]');
		expect(event.message).not.toContain('BV123');
		expect(event.exception.values[0].value).not.toContain('api.bilibili.com');
		expect(event.exception.values[0].stacktrace.frames[0].filename).toBe('[third-party script]');
		expect(event.exception.values[0].stacktrace.frames[0].abs_path).toBeUndefined();
		expect(event.exception.values[0].stacktrace.frames[1].filename).toContain('chrome-extension://');
		expect(event.exception.values[0].stacktrace.frames[1].vars).toBeUndefined();
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});
