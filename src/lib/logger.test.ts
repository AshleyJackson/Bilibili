import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logError } from './logger';
import { dispatchContentScriptError } from './sentry-reporting';

vi.mock('./sentry-reporting', () => ({
	dispatchContentScriptError: vi.fn()
}));

describe('logError', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('forwards logged Error objects without forwarding log context', () => {
		const error = new Error('playurl failed');

		logError('api', 'request failed', { cid: 1234 }, error);

		expect(dispatchContentScriptError).toHaveBeenCalledOnce();
		expect(dispatchContentScriptError).toHaveBeenCalledWith(error, 'api');
	});

	it('does not forward non-error log messages', () => {
		logError('api', 'request failed', { cid: 1234 });

		expect(dispatchContentScriptError).not.toHaveBeenCalled();
	});
});
