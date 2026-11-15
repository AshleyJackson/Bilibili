import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { createSentryPlugins } from './vite.sentry';

export default defineConfig(({ command }) => {
	const sentryEnabled = command === 'build' && Boolean(process.env.SENTRY_AUTH_TOKEN);

	return {
		plugins: [
			tailwindcss(),
			sveltekit(),
			...createSentryPlugins(
				sentryEnabled,
				['./.svelte-kit/output/client/**/*.js', './.svelte-kit/output/client/**/*.js.map'],
				['./.svelte-kit/output/client/**/*.map', './build/**/*.map']
			)
		],
		build: {
			sourcemap: sentryEnabled ? 'hidden' : false
		},
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	};
});
