import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSentryPlugins } from '../vite.sentry';

describe('createSentryPlugins', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('skips Sentry when uploading is disabled or no auth token is available', () => {
		vi.stubEnv('SENTRY_AUTH_TOKEN', '');

		expect(createSentryPlugins(true, [], [])).toEqual([]);
		expect(createSentryPlugins(false, [], [])).toEqual([]);
	});

	it('configures the Sentry plugin when uploading is enabled', () => {
		vi.stubEnv('SENTRY_AUTH_TOKEN', 'unit-test-token');

		expect(createSentryPlugins(true, [], []).length).toBeGreaterThan(0);
	});
});
