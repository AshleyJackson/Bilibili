import { md5 } from 'js-md5';
import { NAV_API, FETCH_DEFAULTS } from './constants';
import { logInfo, logWarn, logError } from './logger';

const MODULE = 'wbi';

/**
 * WBI signing for Bilibili API requests.
 * Required on endpoints like /x/player/wbi/playurl.
 * Algorithm from SocialSisterYi/bilibili-API-collect (maintained fork: melon-444).
 */

// Fixed 64-element shuffle table used to derive the mixin key.
export const MIXIN_KEY_ENC_TAB = [
	46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28,
	14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21,
	56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52
];

const FILTER_CHARS = "!'()*";
const KEY_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedKeys: { imgKey: string; subKey: string; fetchedAt: number } | null = null;

/** Derive the 32-char mixin key from img_key + sub_key using the fixed shuffle table. */
export function getMixinKey(imgKey: string, subKey: string): string {
	const raw = imgKey + subKey;
	let out = '';
	for (const idx of MIXIN_KEY_ENC_TAB) {
		out += raw[idx] ?? '';
	}
	return out.slice(0, 32);
}

/**
 * URL-encode a value the way Bilibili's frontend does: percent-encoded hex is
 * uppercase, spaces become %20 (not +), and the characters !'()* are stripped
 * before encoding.
 */
export function encodeWbiValue(value: string): string {
	const stripped = value.replace(/[!'()*]/g, '');
	// encodeURIComponent lowercases hex for some chars; re-uppercase %xx sequences.
	return encodeURIComponent(stripped)
		.replace(/%[0-9a-f]{2}/g, (m) => m.toUpperCase())
		.replace(/%20/g, '%20');
}

/**
 * Compute the WBI signature for a set of params.
 * Returns a new params object with `wts` and `w_rid` added.
 */
export function encWbi(
	params: Record<string, string>,
	imgKey: string,
	subKey: string
): Record<string, string> {
	const mixinKey = getMixinKey(imgKey, subKey);
	const wts = Math.floor(Date.now() / 1000).toString();

	const withWts: Record<string, string> = { ...params, wts };

	const sortedKeys = Object.keys(withWts).sort();
	const query = sortedKeys
		.map((k) => `${encodeURIComponent(k)}=${encodeWbiValue(withWts[k])}`)
		.join('&');

	const wRid = md5(query + mixinKey);

	return { ...withWts, w_rid: wRid };
}

/** Extract img_key and sub_key filenames (without extension) from the nav API response. */
export function extractKeysFromNav(navData: {
	wbi_img?: { img_url?: string; sub_url?: string };
}): { imgKey: string; subKey: string } | null {
	const img = navData?.wbi_img?.img_url;
	const sub = navData?.wbi_img?.sub_url;
	if (!img || !sub) return null;
	const imgKey = img.split('/').pop()?.split('.')[0] ?? '';
	const subKey = sub.split('/').pop()?.split('.')[0] ?? '';
	if (!imgKey || !subKey) return null;
	return { imgKey, subKey };
}

/** Fetch and cache the WBI keys from the nav API. */
export async function fetchWbiKeys(force = false): Promise<{ imgKey: string; subKey: string }> {
	if (!force && cachedKeys && Date.now() - cachedKeys.fetchedAt < KEY_TTL_MS) {
		logInfo(MODULE, 'using cached WBI keys', { age: Date.now() - cachedKeys.fetchedAt });
		return { imgKey: cachedKeys.imgKey, subKey: cachedKeys.subKey };
	}

	logInfo(MODULE, 'fetching WBI keys from nav API', { force, reason: force ? 'forced' : 'cache miss/expired' });
	const resp = await window.fetch(NAV_API, FETCH_DEFAULTS);
	const json: { code: number; data?: { wbi_img?: { img_url?: string; sub_url?: string } } } =
		await resp.json();
	if (json.code !== 0) {
		logError(MODULE, 'nav API returned non-zero code', json.code);
		throw new Error(`nav API returned code ${json.code}`);
	}
	const keys = extractKeysFromNav(json.data ?? {});
	if (!keys) {
		logError(MODULE, 'failed to extract WBI keys from nav response', json.data);
		throw new Error('failed to extract WBI keys from nav response');
	}
	cachedKeys = { ...keys, fetchedAt: Date.now() };
	logInfo(MODULE, 'WBI keys fetched and cached', { imgKey: keys.imgKey.slice(0, 8) + '...', subKey: keys.subKey.slice(0, 8) + '...' });
	return keys;
}

/** Clear the cached WBI keys (used when a signed request fails). */
export function clearWbiKeys(): void {
	logInfo(MODULE, 'WBI key cache cleared');
	cachedKeys = null;
}

/**
 * Convenience: sign a params object using the current (cached) WBI keys.
 * Fetches keys if not cached.
 */
export async function signWbi(params: Record<string, string>): Promise<Record<string, string>> {
	const { imgKey, subKey } = await fetchWbiKeys();
	const signed = encWbi(params, imgKey, subKey);
	logInfo(MODULE, 'signWbi: params signed', {
		paramCount: Object.keys(signed).length,
		hasWRid: !!signed.w_rid,
		hasWts: !!signed.wts
	});
	return signed;
}
