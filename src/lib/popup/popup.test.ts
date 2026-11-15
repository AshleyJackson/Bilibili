// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DownloadPopup, POPUP_HOST_ID } from './popup';
import { DownloadTasks, type DownloadDeps } from './tasks';
import { ErrorCode } from '../schemas';
import type { DisplayInfo } from '../download';

const info: DisplayInfo = {
	code: ErrorCode.OK,
	title: 'Jensen <img src=x onerror=alert(1)> GPU',
	quality: '480P 标清',
	dash: {
		audio: { id: 1, base_url: 'https://cdn.example/a.m4s', size: 1024 * 1024 },
		video: {
			id: 32,
			base_url: 'https://cdn.example/v.m4s',
			size: 4 * 1024 * 1024,
			width: 852,
			height: 480,
			codecs: 'avc1'
		}
	}
};

let deps: DownloadDeps;
let tasks: DownloadTasks;
let popup: DownloadPopup;
let anchor: HTMLElement;
let onToggle: ReturnType<typeof vi.fn<(open: boolean) => void>>;
let release: ((blob: Blob) => void) | null;
let report: (received: number, total: number) => void;

function root(): ShadowRoot {
	const host = document.getElementById(POPUP_HOST_ID);
	if (!host?.shadowRoot) throw new Error('popup not open');
	return host.shadowRoot;
}

function rows(): HTMLElement[] {
	return [...root().querySelectorAll<HTMLElement>('.row')];
}

function click(el: Element | null): void {
	if (!el) throw new Error('missing element');
	(el as HTMLElement).click();
}

beforeEach(() => {
	release = null;
	report = () => {};
	deps = {
		downloadStream: vi.fn((_seg, onProgress) => {
			report = onProgress;
			return new Promise<Blob>((resolve) => (release = resolve));
		}),
		downloadAndMerge: vi.fn(async () => ({ data: new ArrayBuffer(8), cleanup: () => {} })),
		saveBlob: vi.fn(() => 'blob:saved'),
		revokeUrl: vi.fn(),
		now: () => 0,
		log: vi.fn()
	};
	tasks = new DownloadTasks(deps);
	onToggle = vi.fn<(open: boolean) => void>();
	popup = new DownloadPopup(tasks, () => 0, onToggle);
	anchor = document.createElement('button');
	document.body.appendChild(anchor);
});

afterEach(() => {
	popup.destroy();
	document.body.innerHTML = '';
	vi.unstubAllGlobals();
});

describe('DownloadPopup', () => {
	it('renders the title as text, quality and stream chips, and one row per option', () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');

		const title = root().querySelector('.title')!;
		expect(title.textContent).toBe(info.title);
		expect(root().querySelector('img')).toBeNull();
		expect([...root().querySelectorAll('.chip')].map((c) => c.textContent)).toEqual(['480P 标清', '852×480', 'AVC']);
		expect(rows().map((r) => r.querySelector('.line1 span')!.textContent)).toEqual(['完整视频', '仅画面', '仅声音']);
		expect(rows()[0].querySelector('.badge')?.textContent).toBe('推荐');
		expect(rows()[0].querySelector('.line2')!.textContent).toBe('MP4 · 画面 + 声音 · 5.00MB');
		expect(rows()[0].querySelector('.btn.primary')).not.toBeNull();
		expect(rows()[0].querySelector('[data-action="copy"]')).toBeNull();
		expect(rows()[1].querySelector('[data-action="copy"]')).not.toBeNull();
		expect(onToggle).toHaveBeenLastCalledWith(true);
	});

	it('focuses the first download button only once the popup is positioned and visible', async () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');
		const host = document.getElementById(POPUP_HOST_ID)!;

		expect(host.style.visibility).toBe('hidden');
		expect(root().activeElement).toBeNull();

		await vi.waitFor(() => expect(host.style.visibility).toBe(''));
		expect(root().activeElement).toBe(rows()[0].querySelector('[data-action="download"]'));
	});

	it('does not focus or reveal a popup that closed before positioning finished', async () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');
		const host = document.getElementById(POPUP_HOST_ID)!;
		popup.close();

		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(host.style.visibility).toBe('hidden');
		expect(host.shadowRoot!.activeElement).toBeNull();
	});

	it('does not offer the old mode toggles or an always-visible log box', () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');

		expect(root().querySelector('input')).toBeNull();
		expect(root().querySelector('.logs')).toBeNull();
	});

	it('shows a loading state before info arrives and an error state on failure', () => {
		popup.open(anchor, 'bottom-start');
		expect(root().querySelector('.spinner')).not.toBeNull();

		expect(root().querySelector('.title')!.textContent).toBe('正在获取视频信息');

		popup.setInfo({ code: ErrorCode.VIP_ONLY, message: '大会员专享' });
		expect(root().querySelector('.title')!.textContent).toBe('无法获取下载地址');
		expect(root().querySelector('.state.error strong')!.textContent).toBe('大会员专享');
		expect(rows()).toHaveLength(0);
	});

	it('updates a row in place from idle to progress to saved', async () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');
		const untouched = rows()[2];

		click(rows()[1].querySelector('[data-action="download"]'));
		await vi.waitFor(() => expect(rows()[1].dataset.status).toBe('downloading'));
		report(2 * 1024 * 1024, 4 * 1024 * 1024);
		await vi.waitFor(() => expect(rows()[1].querySelector('.percent')?.textContent).toBe('50%'));
		expect(rows()[1].querySelector('[role="progressbar"]')!.getAttribute('aria-valuenow')).toBe('50');
		expect(rows()[1].querySelector('.line2')!.textContent).toBe('2.00MB / 4.00MB');
		expect(rows()[2]).toBe(untouched);

		release!(new Blob([new Uint8Array(10)]));
		await vi.waitFor(() => expect(rows()[1].dataset.status).toBe('done'));
		const again = rows()[1].querySelector('a.btn') as HTMLAnchorElement;
		expect(again.getAttribute('href')).toBe('blob:saved');
		expect(again.getAttribute('download')).toBe('Jensen _img src=x onerror=alert(1)_ GPU_视频.mp4');
	});

	it('shows the error and a retry button when a download fails', async () => {
		deps.downloadStream = vi.fn(async () => {
			throw new Error('all segment URLs failed');
		});
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');

		click(rows()[2].querySelector('[data-action="download"]'));
		await vi.waitFor(() => expect(rows()[2].dataset.status).toBe('error'));
		expect(rows()[2].querySelector('.line2')!.textContent).toBe('下载失败：all segment URLs failed');
		expect(rows()[2].querySelector('[data-action="download"]')!.textContent).toBe('重试');
	});

	it('keeps download progress across close and reopen', async () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');
		click(rows()[1].querySelector('[data-action="download"]'));
		popup.close();
		expect(document.getElementById(POPUP_HOST_ID)).toBeNull();

		report(1024 * 1024, 4 * 1024 * 1024);
		popup.open(anchor, 'bottom-start');
		expect(rows()[1].querySelector('.percent')!.textContent).toBe('25%');
	});

	it('closes on Escape and on outside pointerdown, but not on the anchor', () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');

		anchor.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
		expect(popup.isOpen()).toBe(true);
		rows()[0].dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
		expect(popup.isOpen()).toBe(true);

		document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
		expect(popup.isOpen()).toBe(false);
		expect(onToggle).toHaveBeenLastCalledWith(false);

		popup.open(anchor, 'bottom-start');
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		expect(popup.isOpen()).toBe(false);
	});

	it('closes from the header close button and toggles from the anchor', () => {
		popup.setInfo(info);
		popup.toggle(anchor, 'bottom-start');
		click(root().querySelector('[data-action="close"]'));
		expect(popup.isOpen()).toBe(false);
		popup.toggle(anchor, 'bottom-start');
		expect(popup.isOpen()).toBe(true);
		popup.toggle(anchor, 'bottom-start');
		expect(popup.isOpen()).toBe(false);
	});

	it('collects logs while closed, shows them on demand, and clears them', () => {
		popup.appendLog('audio: main link https://cdn.example/a.m4s');
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');

		const toggle = root().querySelector('[data-action="toggle-logs"]')!;
		expect(toggle.getAttribute('aria-expanded')).toBe('false');
		expect(toggle.querySelector('.count')!.textContent).toBe(' 1');

		click(toggle);
		expect(root().querySelector('.log-lines')!.textContent).toBe('audio: main link https://cdn.example/a.m4s');
		expect(root().querySelector('[data-action="toggle-logs"]')!.getAttribute('aria-expanded')).toBe('true');

		popup.appendLog('second');
		expect(root().querySelector('.log-lines')!.textContent).toContain('second');
		expect(root().querySelector('.foot .count')!.textContent).toBe(' 2');

		popup.clearLogs();
		expect(root().querySelector('.log-lines')!.textContent).toBe('');
		expect(root().querySelector('.foot .count')!.textContent).toBe('');
	});

	it('keeps at most 300 log lines', () => {
		for (let i = 0; i < 310; i++) popup.appendLog(`line ${i}`);
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');
		click(root().querySelector('[data-action="toggle-logs"]'));
		const lines = root().querySelector('.log-lines')!.textContent!.split('\n');
		expect(lines).toHaveLength(300);
		expect(lines[0]).toBe('line 10');
	});

	it('copies the direct stream URL', async () => {
		const writeText = vi.fn(async () => {});
		vi.stubGlobal('navigator', { clipboard: { writeText } });
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');

		click(rows()[2].querySelector('[data-action="copy"]'));
		expect(writeText).toHaveBeenCalledWith('https://cdn.example/a.m4s');
		await vi.waitFor(() =>
			expect(rows()[2].querySelector('[data-action="copy"]')!.classList.contains('copied')).toBe(true)
		);
	});

	it('re-renders with new options when the quality changes while open', () => {
		popup.setInfo(info);
		popup.open(anchor, 'bottom-start');
		popup.setInfo({ ...info, quality: '1080P 高清', durl: [{ url: 'https://cdn.example/c.flv' }], dash: undefined });

		expect(root().querySelector('.chip.quality')!.textContent).toBe('1080P 高清');
		expect(rows()).toHaveLength(1);
		expect(rows()[0].querySelector('.line2')!.textContent).toBe('FLV · 画面 + 声音');
	});
});
