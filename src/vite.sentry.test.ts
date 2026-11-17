import { afterEach, describe, expect, it, vi } from 'vitest';

const { sentryVitePluginMock } = vi.hoisted(() => ({
	sentryVitePluginMock: vi.fn((_options: unknown) => [{ name: 'sentry-test' as const }])
}));

vi.mock('@sentry/bundler-plugins/vite', () => ({
	sentryVitePlugin: sentryVitePluginMock
}));

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
		vi.stubEnv('RELEASE_VERSION', '3.3.4');

		expect(createSentryPlugins(true, [], []).length).toBeGreaterThan(0);
		expect(sentryVitePluginMock).toHaveBeenCalledWith(
			expect.objectContaining({
				release: { name: 'bilibili-extension@3.3.4' }
			})
		);
	});
});
