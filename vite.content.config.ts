import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
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

	return {
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
			sourcemap: false,
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