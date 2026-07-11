import { GB, MB, KB, SETTING_DOWNLOAD_MODE, SETTING_MERGE_MODE, SETTING_SHOW } from './constants';

// ── Helpers ──

export const isBilibili = (): boolean =>
	location.hostname === 'www.bilibili.com' || location.hostname === 'bilibili.com';

export const isEdge = (): boolean => window.navigator.userAgent.indexOf('Edg/') !== -1;

export const isVideoPage = (): boolean =>
	/\/video\/(av|bv)[0-9a-zA-Z]+/i.test(window.location.pathname);

export const isBangumiPage = (): boolean => /\/bangumi\/play\/\S+/i.test(window.location.pathname);

export function formatSize(bytes: number | undefined | null): string {
	if (!bytes) return '未知大小';
	if (bytes >= GB) return `${(bytes / GB).toFixed(2)}GB`;
	if (bytes >= MB) return `${(bytes / MB).toFixed(2)}MB`;
	if (bytes >= KB) return `${(bytes / KB).toFixed(2)}KB`;
	return `${bytes}B`;
}

// ── Settings ──

export function isAdvancedMode(): boolean {
	return localStorage.getItem(SETTING_DOWNLOAD_MODE) !== 'normal';
}

export function isMergeMode(): boolean {
	return localStorage.getItem(SETTING_MERGE_MODE) !== 'off';
}

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

export function fileToUint8Array(file: File | Blob): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const { result } = reader;
			if (result instanceof ArrayBuffer) {
				resolve(new Uint8Array(result));
			} else {
				resolve(new Uint8Array());
			}
		};
		reader.onerror = (ev) => {
			reject(Error(`File could not be read! Code=${(ev?.target?.error as unknown as { code?: number })?.code ?? -1}`));
		};
		reader.readAsArrayBuffer(file);
	});
}

// ── Download Blob ──

export function downloadBlob(
	data: Uint8Array,
	filename: string,
	container: HTMLElement,
	onDone?: () => void
): void {
	const blob = new Blob([data as BlobPart], { type: 'application/octet-stream' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.setAttribute('href', url);
	anchor.setAttribute('download', filename);
	anchor.setAttribute('style', 'margin-left:10px');
	anchor.innerHTML = '（如果没有弹出下载，请点击这里保存）';
	container.appendChild(anchor);
	anchor.click();
	onDone?.();
}