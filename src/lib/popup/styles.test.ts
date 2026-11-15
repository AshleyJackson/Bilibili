import { describe, expect, it } from 'vitest';
import { POPUP_STYLES } from './styles';

describe('POPUP_STYLES', () => {
	it('never defines a custom property in terms of itself', () => {
		const definitions = [...POPUP_STYLES.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)];
		expect(definitions.length).toBeGreaterThan(0);
		for (const [, name, value] of definitions) {
			expect(value, name).not.toMatch(new RegExp(`var\\(\\s*${name}\\s*[,)]`));
		}
	});

	it('reads muted text colors from local names with Bilibili fallbacks', () => {
		expect(POPUP_STYLES).toContain('--fg2: var(--text2, #61666d);');
		expect(POPUP_STYLES).toContain('--fg3: var(--text3, #9499a0);');
		expect(POPUP_STYLES).not.toMatch(/color:\s*var\(--text[23]\)/);
	});
});
