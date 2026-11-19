import { sentryVitePlugin } from '@sentry/bundler-plugins/vite';
import type { PluginOption } from 'vite';

const org = 'ashley-jackson';
const project = 'bilibili-extension';

export function createSentryPlugins(
	enabled: boolean,
	assets: string[],
	mapsToDelete: string[],
	legacySourcemapPaths: string[] = []
): PluginOption[] {
	const authToken = process.env.SENTRY_AUTH_TOKEN;
	if (!enabled || !authToken) return [];

	const releaseName = process.env.RELEASE_VERSION ? `bilibili-extension@${process.env.RELEASE_VERSION}` : undefined;
	// Keep release-based lookup available for page-world errors captured in the service worker.
	const uploadLegacySourcemaps = legacySourcemapPaths.length
		? { paths: legacySourcemapPaths, urlPrefix: '~/', ext: ['js', 'map'] }
		: undefined;
	const release =
		releaseName || uploadLegacySourcemaps
			? {
					...(releaseName ? { name: releaseName } : {}),
					...(uploadLegacySourcemaps ? { uploadLegacySourcemaps } : {})
				}
			: undefined;

	return sentryVitePlugin({
		org,
		project,
		authToken,
		release,
		telemetry: false,
		sourcemaps: {
			assets,
			filesToDeleteAfterUpload: mapsToDelete
		}
	});
}
