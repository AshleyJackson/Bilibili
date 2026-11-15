import { GB, MB, KB, SETTING_SHOW } from './constants';

// ── Helpers ──

export const isBilibili = (): boolean =>
	location.hostname === 'www.bilibili.com' || location.hostname === 'bilibili.com';

export const isEdge = (): boolean => window.navigator.userAgent.indexOf('Edg/') !== -1;

export const isVideoPage = (): boolean => /\/video\/(av|bv)[0-9a-zA-Z]+/i.test(window.location.pathname);

export const isBangumiPage = (): boolean => /\/bangumi\/play\/\S+/i.test(window.location.pathname);

export function formatSize(bytes: number | undefined | null): string {
	if (!bytes) return '未知大小';
	if (bytes >= GB) return `${(bytes / GB).toFixed(2)}GB`;
	if (bytes >= MB) return `${(bytes / MB).toFixed(2)}MB`;
	if (bytes >= KB) return `${(bytes / KB).toFixed(2)}KB`;
	return `${bytes}B`;
}

// ── Settings ──

export function isHidden(): boolean {
	return localStorage.getItem(SETTING_SHOW) === 'hide';
}

// ── Internals from injected data ──

export interface Internals {
	name: string;
	version: string;
	baseUrl: string;
}

export function getInternals(): Internals {
	const el = document.getElementById('bilibili-helper-ext-content-script');
	const { manifest, baseUrl } = JSON.parse(el!.dataset.internals as string);
	return { ...manifest, baseUrl };
}

// ── Wait for element ──

export function waitForElement(selector: string): Promise<Element | null> {
	return new Promise((resolve) => {
		let count = 0;
		const interval = setInterval(() => {
			count++;
			const el = document.querySelector(selector);
			if (el || count > 100) {
				clearInterval(interval);
				resolve(el);
			}
		}, 300);
	});
}

// ── Convert file to Uint8Array ──

export async function fileToUint8Array(file: File | Blob): Promise<Uint8Array> {
	try {
		return new Uint8Array(await file.arrayBuffer());
	} catch {
		throw new Error('Unable to read file data. Please try the download again.');
	}
}

// ── Download Blob ──

/**
 * Trigger a browser save for `blob` and return its object URL. The caller owns
 * the URL (it backs the "save again" link) and must revoke it when done.
 */
export function saveBlob(blob: Blob, filename: string): string {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	return url;
}
