// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	fileToUint8Array,
	formatSize,
	getInternals,
	isBangumiPage,
	isBilibili,
	isEdge,
	isHidden,
	isVideoPage,
	saveBlob,
	waitForElement
} from './utils';
import { CONTENT_SCRIPT_ELEMENT_ID, GB, KB, MB, SETTING_SHOW } from './constants';

describe('formatSize', () => {
	it('formats bytes at each size threshold', () => {
		expect(formatSize(0)).toBe('未知大小');
		expect(formatSize(1)).toBe('1B');
		expect(formatSize(KB)).toBe('1.00KB');
		expect(formatSize(MB)).toBe('1.00MB');
		expect(formatSize(GB)).toBe('1.00GB');
	});

	it('handles missing, negative, and fractional byte counts', () => {
		expect(formatSize(undefined)).toBe('未知大小');
		expect(formatSize(null)).toBe('未知大小');
		expect(formatSize(-1)).toBe('-1B');
		expect(formatSize(1.5)).toBe('1.5B');
	});
});

describe('page and browser detection', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('matches Bilibili hostnames and rejects other sites', () => {
		vi.stubGlobal('location', { hostname: 'www.bilibili.com' });
		expect(isBilibili()).toBe(true);
		vi.stubGlobal('location', { hostname: 'bilibili.com' });
		expect(isBilibili()).toBe(true);
		vi.stubGlobal('location', { hostname: 'm.bilibili.com' });
		expect(isBilibili()).toBe(false);
	});

	it('detects Edge from its user agent token', () => {
		vi.stubGlobal('window', { navigator: { userAgent: 'Mozilla/5.0 Edg/123.0' } });
		expect(isEdge()).toBe(true);
		vi.stubGlobal('window', { navigator: { userAgent: 'Mozilla/5.0 Chrome/123.0' } });
		expect(isEdge()).toBe(false);
	});

	it('recognizes video and bangumi routes', () => {
		vi.stubGlobal('window', { location: { pathname: '/video/BV123' } });
		expect(isVideoPage()).toBe(true);
		expect(isBangumiPage()).toBe(false);
		vi.stubGlobal('window', { location: { pathname: '/bangumi/play/ep123' } });
		expect(isBangumiPage()).toBe(true);
		expect(isVideoPage()).toBe(false);
	});
});

describe('download settings', () => {
	afterEach(() => localStorage.clear());

	it('is visible by default unless explicitly hidden', () => {
		localStorage.clear();
		expect(isHidden()).toBe(false);

		localStorage.setItem(SETTING_SHOW, 'hide');
		expect(isHidden()).toBe(true);
	});
});

describe('getInternals', () => {
	it('reads manifest details and the extension base URL from the injected node', () => {
		const el = document.createElement('div');
		el.id = CONTENT_SCRIPT_ELEMENT_ID;
		el.dataset.internals = JSON.stringify({
			manifest: { name: 'Bilibili helper', version: '3.2.0' },
			baseUrl: 'chrome-extension://extension-id'
		});
		document.body.appendChild(el);

		expect(getInternals()).toEqual({
			name: 'Bilibili helper',
			version: '3.2.0',
			baseUrl: 'chrome-extension://extension-id'
		});
	});
});

describe('waitForElement', () => {
	afterEach(() => vi.useRealTimers());

	it('resolves when the requested element appears', async () => {
		vi.useFakeTimers();
		const pending = waitForElement('#late-element');
		const element = document.createElement('div');
		element.id = 'late-element';
		document.body.appendChild(element);

		await vi.advanceTimersByTimeAsync(300);

		await expect(pending).resolves.toBe(element);
	});

	it('returns null after the polling limit', async () => {
		vi.useFakeTimers();
		const pending = waitForElement('#missing-element');
		await vi.advanceTimersByTimeAsync(30_300);
		await expect(pending).resolves.toBeNull();
	});
});

describe('file and blob utilities', () => {
	it('reads Blob bytes through FileReader', async () => {
		const bytes = await fileToUint8Array(new Blob([new Uint8Array([1, 2, 255])]));
		expect(Array.from(bytes)).toEqual([1, 2, 255]);
	});

	it('saves a blob through a download anchor and returns its object URL', () => {
		const originalUrl = URL;
		const createObjectURL = vi.fn(() => 'blob:download');
		const mockUrl = class extends originalUrl {};
		Object.defineProperty(mockUrl, 'createObjectURL', { value: createObjectURL });
		vi.stubGlobal('URL', mockUrl);
		let clicked: HTMLAnchorElement | null = null;
		vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
			clicked = this;
		});
		const blob = new Blob([new Uint8Array([1, 2])]);

		const url = saveBlob(blob, 'clip.mp4');

		expect(url).toBe('blob:download');
		expect(createObjectURL).toHaveBeenCalledWith(blob);
		expect(clicked!.getAttribute('href')).toBe('blob:download');
		expect(clicked!.download).toBe('clip.mp4');
		expect(clicked!.isConnected).toBe(false);
	});
});
