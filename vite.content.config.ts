import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
	const entryName = mode === 'seed' ? 'bilibili-helper-content-script-seed' : 'bilibili-helper-content-script';
	const entryFile = mode === 'seed' ? 'seed.ts' : 'main.ts';

	return {
		resolve: {
			alias: {
				$lib: resolve(__dirname, 'src/lib')
			}
		},
		build: {
			lib: {
				entry: resolve(__dirname, `src/content-script/${entryFile}`),
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