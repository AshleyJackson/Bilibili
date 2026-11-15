export default {
	plugins: ['prettier-plugin-svelte'],
	endOfLine: 'lf',
	printWidth: 120,
	singleQuote: true,
	trailingComma: 'none',
	useTabs: true,
	overrides: [
		{
			files: '*.svelte',
			options: { parser: 'svelte' }
		}
	]
};
