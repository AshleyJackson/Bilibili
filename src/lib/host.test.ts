// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorCode } from './schemas';
import type { DisplayInfo } from './download';

const orchestration = vi.hoisted(() => ({
	release: null as ((blob: Blob) => void) | null,
	report: (() => {}) as (received: number, total: number) => void
}));

vi.mock('./logger', () => ({ logInfo: vi.fn(), logWarn: vi.fn(), logError: vi.fn() }));
vi.mock('./downloader/orchestration', async (importOriginal) => {
	const actual = await importOriginal<typeof import('./downloader/orchestration')>();
	return {
		...actual,
		downloadStream: vi.fn((_seg: unknown, onProgress: (r: number, t: number) => void) => {
			orchestration.report = onProgress;
			return new Promise<Blob>((resolve) => (orchestration.release = resolve));
		}),
		downloadAndMerge: vi.fn()
	};
});

const { showDownloadInfo, cleanup, log, clearLogs, DOWNLOAD_BTN_ID } = await import('./host');
const { POPUP_HOST_ID } = await import('./popup/popup');

const info: DisplayInfo = {
	code: ErrorCode.OK,
	title: 'clip',
	quality: '720P 准高清',
	dash: {
		audio: { id: 1, base_url: 'https://cdn.example/a.m4s', size: 100 },
		video: { id: 64, base_url: 'https://cdn.example/v.m4s', size: 300 }
	}
};

function toolbar(): HTMLElement {
	const bar = document.createElement('div');
	bar.className = 'video-toolbar-left';
	bar.innerHTML = `
		<div class="toolbar-left-item-wrap" id="like"></div>
		<div class="toolbar-left-item-wrap" id="share"><div class="video-share-wrap"></div></div>
		<div class="toolbar-left-item-wrap" id="after"></div>`;
	document.body.appendChild(bar);
	return bar;
}

function shadow(): ShadowRoot {
	return document.getElementById(POPUP_HOST_ID)!.shadowRoot!;
}

beforeEach(() => {
	URL.revokeObjectURL = vi.fn();
	URL.createObjectURL = vi.fn(() => 'blob:x');
	vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
	cleanup();
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('host', () => {
	it('injects the button right after the share button', () => {
		toolbar();
		showDownloadInfo(info);

		const btn = document.getElementById(DOWNLOAD_BTN_ID)!;
		expect(btn.previousElementSibling?.id).toBe('share');
		expect(btn.nextElementSibling?.id).toBe('after');
		expect(btn.textContent).toContain('下载');
		expect(btn.getAttribute('role')).toBe('button');
	});

	it('falls back to a floating button without a toolbar', () => {
		showDownloadInfo(info);
		const btn = document.getElementById(DOWNLOAD_BTN_ID)!;
		expect(btn.parentElement).toBe(document.body);
		expect(btn.style.position).toBe('fixed');
	});

	it('re-injects the button when the page drops it', () => {
		const bar = toolbar();
		showDownloadInfo(info);
		document.getElementById(DOWNLOAD_BTN_ID)!.remove();
		bar.querySelector('#share')!.after(document.createElement('div'));

		showDownloadInfo(info);
		expect(document.querySelectorAll(`#${DOWNLOAD_BTN_ID}`)).toHaveLength(1);
	});

	it('toggles the popup on click and Enter, and reflects it in aria-expanded', () => {
		toolbar();
		showDownloadInfo(info);
		const btn = document.getElementById(DOWNLOAD_BTN_ID)!;

		btn.click();
		expect(document.getElementById(POPUP_HOST_ID)).not.toBeNull();
		expect(btn.getAttribute('aria-expanded')).toBe('true');

		btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect(document.getElementById(POPUP_HOST_ID)).toBeNull();
		expect(btn.getAttribute('aria-expanded')).toBe('false');
	});

	it('shows overall progress on the button while a download runs', async () => {
		toolbar();
		showDownloadInfo(info);
		const btn = document.getElementById(DOWNLOAD_BTN_ID)!;
		btn.click();
		(shadow().querySelector('[data-row^="video:"] [data-action="download"]') as HTMLElement).click();
		btn.click();

		orchestration.report(150, 300);
		expect(btn.querySelector('[data-label]')!.textContent).toBe('50%');
		expect(btn.hasAttribute('data-busy')).toBe(true);

		orchestration.release!(new Blob([new Uint8Array(3)]));
		await vi.waitFor(() => expect(btn.querySelector('[data-label]')!.textContent).toBe('下载'));
		expect(btn.hasAttribute('data-busy')).toBe(false);
	});

	it('routes log() lines to the popup log panel and clears them', () => {
		toolbar();
		log('video:', { id: 64 });
		showDownloadInfo(info);
		document.getElementById(DOWNLOAD_BTN_ID)!.click();
		(shadow().querySelector('[data-action="toggle-logs"]') as HTMLElement).click();

		expect(shadow().querySelector('.log-lines')!.textContent).toBe('video: {"id":64}');
		clearLogs();
		expect(shadow().querySelector('.log-lines')!.textContent).toBe('');
	});

	it('cleanup() removes the button and popup', () => {
		toolbar();
		showDownloadInfo(info);
		document.getElementById(DOWNLOAD_BTN_ID)!.click();
		cleanup();
		expect(document.getElementById(DOWNLOAD_BTN_ID)).toBeNull();
		expect(document.getElementById(POPUP_HOST_ID)).toBeNull();
	});
});
