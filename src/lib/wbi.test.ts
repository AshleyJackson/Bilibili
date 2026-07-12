import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	MIXIN_KEY_ENC_TAB,
	getMixinKey,
	encodeWbiValue,
	encWbi,
	extractKeysFromNav,
	tryExtractKeysFromPage
} from './wbi';

// Documented test vectors from SocialSisterYi/bilibili-API-collect (maintained fork).
const IMG_KEY = '7cd084941338484aae1ad9425b84077c';
const SUB_KEY = '4932caff0ff746eab6f01bf08b70ac45';
const EXPECTED_MIXIN_KEY = 'ea1db124af3c7062474693fa704f4ff8';

describe('MIXIN_KEY_ENC_TAB', () => {
	it('has exactly 64 entries', () => {
		expect(MIXIN_KEY_ENC_TAB).toHaveLength(64);
	});

	it('contains indices in range 0..63', () => {
		for (const idx of MIXIN_KEY_ENC_TAB) {
			expect(idx).toBeGreaterThanOrEqual(0);
			expect(idx).toBeLessThanOrEqual(63);
		}
	});
});

describe('getMixinKey', () => {
	it('derives the documented mixin key', () => {
		expect(getMixinKey(IMG_KEY, SUB_KEY)).toBe(EXPECTED_MIXIN_KEY);
	});

	it('produces a 32-character string', () => {
		expect(getMixinKey(IMG_KEY, SUB_KEY)).toHaveLength(32);
	});

	it('is symmetric in the sense of depending on the concatenation order', () => {
		// Reversing the inputs should produce a different (but still valid) key.
		const a = getMixinKey(IMG_KEY, SUB_KEY);
		const b = getMixinKey(SUB_KEY, IMG_KEY);
		expect(a).not.toBe(b);
		expect(b).toHaveLength(32);
	});
});

describe('encodeWbiValue', () => {
	it('strips the forbidden characters', () => {
		expect(encodeWbiValue("a!b'(c)*d")).toBe('abcd');
	});

	it('encodes spaces as %20 (not +)', () => {
		expect(encodeWbiValue('a b')).toBe('a%20b');
	});

	it('uppercases percent-encoded hex', () => {
		// encodeURIComponent produces lowercase %2f for '/'; we want %2F.
		expect(encodeWbiValue('a/b')).toBe('a%2Fb');
	});

	it('encodes Chinese characters', () => {
		expect(encodeWbiValue('测试')).toBe('%E6%B5%8B%E8%AF%95');
	});
});

describe('encWbi', () => {
	beforeEach(() => {
		// Pin time so w_rid is deterministic. The documented example uses wts=1702204169.
		vi.useFakeTimers();
		vi.setSystemTime(1702204169 * 1000);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('adds wts and w_rid to the params', () => {
		const signed = encWbi({ foo: '114', bar: '514' }, IMG_KEY, SUB_KEY);
		expect(signed.wts).toBe('1702204169');
		expect(signed.w_rid).toMatch(/^[0-9a-f]{32}$/);
	});

	it('produces a stable w_rid for fixed inputs', () => {
		// Deterministic: same inputs → same w_rid.
		const a = encWbi({ foo: '114', bar: '514' }, IMG_KEY, SUB_KEY);
		const b = encWbi({ foo: '114', bar: '514' }, IMG_KEY, SUB_KEY);
		expect(a.w_rid).toBe(b.w_rid);
	});

	it('filters forbidden chars from values before signing', () => {
		const without = encWbi({ foo: 'abc' }, IMG_KEY, SUB_KEY);
		const withFiltered = encWbi({ foo: "a!'(b)*c" }, IMG_KEY, SUB_KEY);
		expect(withFiltered.w_rid).toBe(without.w_rid);
	});

	it('changes w_rid when params change', () => {
		const a = encWbi({ foo: '114' }, IMG_KEY, SUB_KEY);
		const b = encWbi({ foo: '115' }, IMG_KEY, SUB_KEY);
		expect(a.w_rid).not.toBe(b.w_rid);
	});
});

describe('extractKeysFromNav', () => {
	it('extracts img_key and sub_key from nav response URLs', () => {
		const result = extractKeysFromNav({
			wbi_img: {
				img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png',
				sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png'
			}
		});
		expect(result).toEqual({ imgKey: IMG_KEY, subKey: SUB_KEY });
	});

	it('returns null when fields are missing', () => {
		expect(extractKeysFromNav({})).toBeNull();
		expect(extractKeysFromNav({ wbi_img: {} })).toBeNull();
	});
});

describe('tryExtractKeysFromPage', () => {
	const mockWindow = (state: unknown) =>
		vi.stubGlobal('window', { __INITIAL_STATE__: state } as unknown as Window & typeof globalThis);

	beforeEach(() => {
		vi.unstubAllGlobals();
	});

	it('extracts WBI keys from window.__INITIAL_STATE__', () => {
		mockWindow({
			wbi_img: {
				img_url: 'https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png',
				sub_url: 'https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png'
			}
		});
		const result = tryExtractKeysFromPage();
		expect(result).toEqual({ imgKey: IMG_KEY, subKey: SUB_KEY });
	});

	it('returns null when __INITIAL_STATE__ is missing wbi_img', () => {
		mockWindow({});
		expect(tryExtractKeysFromPage()).toBeNull();
	});

	it('returns null when __INITIAL_STATE__ is not present', () => {
		// window exists but no __INITIAL_STATE__
		vi.stubGlobal('window', {} as Window & typeof globalThis);
		expect(tryExtractKeysFromPage()).toBeNull();
	});
});
