import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	contentScriptReleaseFromStack,
	createSentryReportRateLimiter,
	createSentryErrorMessage,
	dispatchContentScriptError,
	forwardContentScriptErrorMessage,
	isSentryErrorMessage,
	reportErrorToSentry,
	sanitizeSentryEvent,
	serializeSentryError,
	SENTRY_REPORT_RATE_LIMITS,
	SENTRY_ERROR_MESSAGE_TYPE
} from './sentry-reporting';

describe('contentScriptReleaseFromStack', () => {
	const extensionId = 'a'.repeat(32);

	it('uses the script URL version instead of the current worker version', () => {
		const stack = `TypeError: failed\n    at L (chrome-extension://${extensionId}/bilibili-helper-content-script.js?v=3.0.4:176:50)`;

		expect(contentScriptReleaseFromStack(stack, extensionId)).toBe('bilibili-extension@3.0.4');
	});

	it('ignores stacks from a different extension or without a versioned script URL', () => {
		expect(
			contentScriptReleaseFromStack(
				' at L (chrome-extension://bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb/bilibili-helper-content-script.js?v=3.0.4:176:50)',
				extensionId
			)
		).toBeUndefined();
		expect(
			contentScriptReleaseFromStack(
				` at L (chrome-extension://${extensionId}/bilibili-helper-content-script.js:176:50)`,
				extensionId
			)
		).toBeUndefined();
	});
});

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

	it('does not report fetch errors blocked by uBlock Origin', () => {
		const dispatchEvent = vi.fn();
		vi.stubGlobal('window', { dispatchEvent });
		const error = new TypeError('Failed to fetch');
		const ublockFrame =
			'chrome-extension://dgjbaljgolmlcmmklmmeafecikidmjpi/rulesets/scripting/scriptlet/ublock-filters.prevent-fetch.js';
		error.stack = `${error.stack}\n    at Object.apply (${ublockFrame}:147:33)`;

		dispatchContentScriptError(error, 'stream');

		expect(dispatchEvent).not.toHaveBeenCalled();
	});

	it('does not report the expected unsupported Bilibili stream URL validation error', () => {
		const dispatchEvent = vi.fn();
		vi.stubGlobal('window', { dispatchEvent });

		dispatchContentScriptError(new Error('Unsupported Bilibili stream URL'), 'stream');
		dispatchContentScriptError('Unsupported Bilibili stream URL', 'stream');

		expect(dispatchEvent).not.toHaveBeenCalled();
	});

	it('still reports errors that only mention an unsupported Bilibili stream URL', () => {
		const dispatchEvent = vi.fn();
		vi.stubGlobal('window', { dispatchEvent });

		dispatchContentScriptError(new Error('Unsupported Bilibili stream URL: https://example.com/video.m4s'), 'stream');

		expect(dispatchEvent).toHaveBeenCalledOnce();
		expect(dispatchEvent.mock.calls[0][0].detail.error.message).toBe(
			'Unsupported Bilibili stream URL: https://example.com/video.m4s'
		);
	});

	it('forwards only valid reports to the extension service worker', async () => {
		const sendMessage = vi.fn(() => Promise.resolve({ sent: true }));
		vi.stubGlobal('chrome', {
			runtime: { id: 'extension-id', sendMessage }
		});
		const message = createSentryErrorMessage('reported', 'content-script');

		await expect(forwardContentScriptErrorMessage(message)).resolves.toBe(true);
		await expect(
			forwardContentScriptErrorMessage({
				...message,
				source: 'extension-popup'
			})
		).resolves.toBe(false);
		await expect(forwardContentScriptErrorMessage({ ...message, source: 'website' })).resolves.toBe(false);

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

describe('createSentryReportRateLimiter', () => {
	it('keeps page-origin reports from consuming the popup allowance', () => {
		const allowReport = createSentryReportRateLimiter();
		const contentLimit = SENTRY_REPORT_RATE_LIMITS['content-script'];
		const popupLimit = SENTRY_REPORT_RATE_LIMITS['extension-popup'];

		for (let report = 0; report < contentLimit; report += 1) {
			expect(allowReport('content-script', report)).toBe(true);
		}
		expect(allowReport('content-script', contentLimit)).toBe(false);

		for (let report = 0; report < popupLimit; report += 1) {
			expect(allowReport('extension-popup', report)).toBe(true);
		}
		expect(allowReport('extension-popup', popupLimit)).toBe(false);
		expect(allowReport('content-script', popupLimit + 1)).toBe(false);
	});

	it('resets each source allowance independently', () => {
		const allowReport = createSentryReportRateLimiter({ 'content-script': 2, 'extension-popup': 2 }, 10);

		expect(allowReport('content-script', 0)).toBe(true);
		expect(allowReport('content-script', 1)).toBe(true);
		expect(allowReport('content-script', 2)).toBe(false);
		expect(allowReport('extension-popup', 2)).toBe(true);
		expect(allowReport('extension-popup', 3)).toBe(true);
		expect(allowReport('extension-popup', 4)).toBe(false);
		expect(allowReport('content-script', 10)).toBe(true);
		expect(allowReport('extension-popup', 11)).toBe(false);
		expect(allowReport('extension-popup', 12)).toBe(true);
	});
});

describe('sanitizeSentryEvent', () => {
	it('removes request and user data and redacts page URLs', () => {
		const event = {
			message: 'Failed at https://www.bilibili.com/video/BV123?token=secret',
			request: {
				url: 'https://www.bilibili.com/video/BV123?token=secret'
			},
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
