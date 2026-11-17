import { sentryVitePlugin } from '@sentry/bundler-plugins/vite';
import type { PluginOption } from 'vite';

const org = 'ashley-jackson';
const project = 'bilibili-extension';

export function createSentryPlugins(enabled: boolean, assets: string[], mapsToDelete: string[]): PluginOption[] {
	const authToken = process.env.SENTRY_AUTH_TOKEN;
	if (!enabled || !authToken) return [];

	return sentryVitePlugin({
		org,
		project,
		authToken,
		release: process.env.RELEASE_VERSION ? { name: `bilibili-extension@${process.env.RELEASE_VERSION}` } : undefined,
		telemetry: false,
		sourcemaps: {
			assets,
			filesToDeleteAfterUpload: mapsToDelete
		}
	});
}
