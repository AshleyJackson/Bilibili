// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	downloadBlob,
	fileToUint8Array,
	formatSize,
	getInternals,
	isAdvancedMode,
	isBangumiPage,
	isBilibili,
	isEdge,
	isHidden,
	isMergeMode,
	isVideoPage,
	waitForElement
} from './utils';
import {
	CONTENT_SCRIPT_ELEMENT_ID,
	GB,
	KB,
	MB,
	SETTING_DOWNLOAD_MODE,
	SETTING_MERGE_MODE,
	SETTING_SHOW
} from './constants';

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

	it('uses advanced and merge modes by default unless explicitly disabled', () => {
		localStorage.clear();
		expect(isAdvancedMode()).toBe(true);
		expect(isMergeMode()).toBe(true);
		expect(isHidden()).toBe(false);

		localStorage.setItem(SETTING_DOWNLOAD_MODE, 'normal');
		localStorage.setItem(SETTING_MERGE_MODE, 'off');
		localStorage.setItem(SETTING_SHOW, 'hide');
		expect(isAdvancedMode()).toBe(false);
		expect(isMergeMode()).toBe(false);
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
	it('reads Blob bytes through arrayBuffer', async () => {
		const bytes = await fileToUint8Array(new Blob([new Uint8Array([1, 2, 255])]));
		expect(Array.from(bytes)).toEqual([1, 2, 255]);
	});

	it('rejects failed reads with a stable message and no underlying details', async () => {
		const blob = new Blob([new Uint8Array([1])]);
		vi.spyOn(blob, 'arrayBuffer').mockRejectedValue(new Error('sensitive underlying detail'));

		let error: unknown;
		try {
			await fileToUint8Array(blob);
		} catch (err) {
			error = err;
		}
		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).toBe('Unable to read file data. Please try the download again.');
		expect((error as Error).message).not.toContain('sensitive underlying detail');
	});

	it('creates a downloadable anchor and invokes the completion callback', () => {
		const originalUrl = URL;
		const createObjectURL = vi.fn(() => 'blob:download');
		const mockUrl = class extends originalUrl {};
		Object.defineProperty(mockUrl, 'createObjectURL', { value: createObjectURL });
		vi.stubGlobal('URL', mockUrl);
		const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
		const container = document.createElement('div');
		const onDone = vi.fn();

		downloadBlob(new Uint8Array([1, 2]), 'clip.mp4', container, onDone);

		const anchor = container.querySelector('a')!;
		expect(createObjectURL).toHaveBeenCalledOnce();
		expect(anchor.getAttribute('href')).toBe('blob:download');
		expect(anchor.download).toBe('clip.mp4');
		expect(click).toHaveBeenCalledOnce();
		expect(onDone).toHaveBeenCalledOnce();
	});
});
