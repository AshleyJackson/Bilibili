import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';

const babelOptions = {
	requireConfigFile: false,
	babelOptions: {
		plugins: ['@babel/plugin-syntax-typescript']
	}
};

export default [
	{
		ignores: [
			'**/build/**',
			'**/coverage/**',
			'**/node_modules/**',
			'**/.svelte-kit/**',
			'static/assets/**',
			'static/bilibili-helper-content-script*.js',
			'static/bilibili-helper-service-worker.js',
			'static/ffmpeg-core.*',
			'static/ffmpeg.worker.js'
		]
	},
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.{cjs,js,mjs,ts}'],
		languageOptions: {
			parser: babelParser,
			parserOptions: babelOptions,
			globals: {
				...globals.browser,
				...globals.node,
				...globals.vitest,
				chrome: 'readonly'
			}
		}
	},
	{
		files: ['**/*.ts'],
		rules: {
			'no-undef': 'off',
			'no-unused-vars': 'off'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: {
					ts: babelParser,
					typescript: babelParser
				},
				...babelOptions
			}
		}
	},
	prettier
];
