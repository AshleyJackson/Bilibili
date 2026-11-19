import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createSentryPlugins } from './vite.sentry';

export default defineConfig(({ mode, command }) => {
	const isSeed = mode === 'seed';
	const isWorker = mode === 'worker';
	const entryName = isSeed
		? 'bilibili-helper-content-script-seed'
		: isWorker
			? 'bilibili-helper-service-worker'
			: 'bilibili-helper-content-script';
	const entryFile = isWorker
		? resolve(__dirname, 'src/background/service-worker.ts')
		: resolve(__dirname, `src/content-script/${isSeed ? 'seed.ts' : 'main.ts'}`);
	const sentryEnabled = command === 'build' && Boolean(process.env.SENTRY_AUTH_TOKEN);
	const entryAsset = `./static/${entryName}.js`;
	const chunkAssets = ['./static/assets/**/*.js', './static/assets/**/*.js.map'];
	const mapAssets = [`${entryAsset}.map`, './static/assets/**/*.js.map'];
	const legacySourcemapPaths = [entryAsset, `${entryAsset}.map`, ...(!isSeed && !isWorker ? ['./static/assets'] : [])];

	return {
		plugins: [
			...createSentryPlugins(
				sentryEnabled,
				[entryAsset, `${entryAsset}.map`, ...chunkAssets],
				mapAssets,
				legacySourcemapPaths
			)
		],
		resolve: {
			alias: {
				$lib: resolve(__dirname, 'src/lib')
			}
		},
		build: {
			lib: {
				entry: entryFile,
				formats: ['es'],
				name: 'BilibiliHelper'
			},
			outDir: 'static',
			emptyOutDir: false,
			minify: false,
			sourcemap: sentryEnabled ? 'hidden' : false,
			rollupOptions: {
				output: {
					entryFileNames: `${entryName}.js`,
					chunkFileNames: 'assets/[name]-[hash].js',
					extend: true
				}
			}
		}
	};
});
