/**
 * Host UI for the Bilibili download helper.
 *
 * Injects a "下载" button into the video toolbar (after the share button, or a
 * floating button when the toolbar is missing) and wires it to the download
 * popup. The button doubles as a progress indicator while downloads run with
 * the popup closed.
 */

import type { Placement } from '@floating-ui/dom';
import { saveBlob } from './utils';
import { downloadStream, downloadAndMerge } from './downloader/orchestration';
import { DownloadTasks } from './popup/tasks';
import { DownloadPopup } from './popup/popup';
import { ICONS } from './popup/icons';
import type { DisplayInfo } from './download';
import { logInfo, logWarn } from './logger';

export type { DisplayInfo } from './download';

const MODULE = 'host';
export const DOWNLOAD_BTN_ID = 'bilibili-helper-download-btn';
const IDLE_LABEL = '下载';

let tasks: DownloadTasks | null = null;
let popup: DownloadPopup | null = null;
let btnEl: HTMLElement | null = null;
let btnLabel: HTMLElement | null = null;
let placement: Placement = 'bottom-start';
let observer: MutationObserver | null = null;
let restoreQueued = false;

const schedule: (cb: () => void) => void =
	typeof requestAnimationFrame === 'function' ? (cb) => requestAnimationFrame(cb) : (cb) => setTimeout(cb, 16);

function controller(): DownloadPopup {
	if (popup) return popup;
	tasks = new DownloadTasks({
		downloadStream: (segment, onProgress) => downloadStream(segment, onProgress),
		downloadAndMerge: (segments, onProgress, onMerging) => downloadAndMerge(segments, onProgress, onMerging),
		saveBlob,
		revokeUrl: (url) => URL.revokeObjectURL(url),
		now: () => Date.now(),
		log: (line) => popup?.appendLog(line)
	});
	tasks.subscribe(updateButtonLabel);
	popup = new DownloadPopup(tasks, undefined, (open) => btnEl?.setAttribute('aria-expanded', String(open)));
	return popup;
}

function updateButtonLabel(): void {
	if (!btnLabel || !tasks) return;
	const { active, percent } = tasks.summary();
	const label = active === 0 ? IDLE_LABEL : percent === null ? '处理中' : `${percent}%`;
	if (btnLabel.textContent !== label) btnLabel.textContent = label;
	btnEl?.toggleAttribute('data-busy', active > 0);
}

/** Remove the floating bottom bar left behind by older versions. */
function cleanupOldHost(): void {
	const old = document.getElementById('bilibili-helper-host');
	if (old) {
		old.remove();
		logInfo(MODULE, 'removed old floating host bar');
	}
}

function onButtonActivate(event: Event): void {
	if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
	event.preventDefault();
	if (btnEl) controller().toggle(btnEl, placement);
}

function decorate(el: HTMLElement): void {
	el.id = DOWNLOAD_BTN_ID;
	el.setAttribute('role', 'button');
	el.setAttribute('tabindex', '0');
	el.setAttribute('aria-haspopup', 'dialog');
	el.setAttribute('aria-expanded', 'false');
	el.title = '下载当前视频';
	el.addEventListener('click', onButtonActivate);
	el.addEventListener('keydown', onButtonActivate);
}

function createFloatingButton(): HTMLElement {
	const el = document.createElement('div');
	el.style.cssText = [
		'position:fixed',
		'right:24px',
		'bottom:24px',
		'z-index:99999',
		'display:flex',
		'align-items:center',
		'gap:6px',
		'height:40px',
		'padding:0 16px',
		'border-radius:20px',
		'background:var(--brand_pink,#ff6699)',
		'color:#fff',
		'font-size:14px',
		'font-weight:500',
		'cursor:pointer',
		'box-shadow:0 6px 16px rgba(255,102,153,.35)',
		'user-select:none'
	].join(';');
	el.innerHTML = `<span style="display:block;width:18px;height:18px">${ICONS.download}</span><span data-label></span>`;
	return el;
}

function createToolbarButton(): HTMLElement {
	const el = document.createElement('div');
	el.className = 'toolbar-left-item-wrap';
	el.style.cssText = 'display:inline-flex;align-items:center;cursor:pointer;';
	el.innerHTML = `
		<div class="video-toolbar-left-item" style="display:flex;align-items:center;gap:6px;color:var(--text2,#61666d);font-size:13px">
			<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="video-toolbar-item-icon" fill="currentColor" aria-hidden="true">
				<path d="M23 17v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5h2v5h14v-5h2z"/>
				<path d="M14 4a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L13 14.586V5a1 1 0 0 1 1-1z"/>
			</svg>
			<span data-label style="font-variant-numeric:tabular-nums"></span>
		</div>
	`;
	return el;
}

function findShareItem(): Element | null {
	return (
		document.querySelector('.toolbar-left-item-wrap .video-share-wrap')?.closest('.toolbar-left-item-wrap') ?? null
	);
}

/** The button was dropped by a re-render, or is floating while a toolbar now exists. */
function buttonNeedsRestore(): boolean {
	if (!btnEl) return false;
	if (!btnEl.isConnected) return true;
	return placement === 'top-end' && findShareItem() !== null;
}

function restoreButton(): void {
	restoreQueued = false;
	if (!buttonNeedsRestore()) return;
	logInfo(MODULE, 'download button missing or misplaced, restoring');
	ensureButton();
}

/**
 * Bilibili's SPA can re-render the toolbar without a URL or quality change,
 * so the button is restored on DOM changes rather than on new video data.
 */
function watchButton(): void {
	if (observer || typeof MutationObserver !== 'function') return;
	observer = new MutationObserver(() => {
		if (restoreQueued || !buttonNeedsRestore()) return;
		restoreQueued = true;
		schedule(restoreButton);
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

/** Inject the download button, or move it back into a re-rendered toolbar. */
function ensureButton(): HTMLElement {
	if (btnEl && !buttonNeedsRestore()) return btnEl;
	btnEl?.remove();
	cleanupOldHost();

	const shareItem = findShareItem();
	if (shareItem?.parentNode) {
		btnEl = createToolbarButton();
		placement = 'bottom-start';
		shareItem.parentNode.insertBefore(btnEl, shareItem.nextSibling);
		logInfo(MODULE, 'download button injected after share button');
	} else {
		logWarn(MODULE, 'share button not found, using floating download button');
		btnEl = createFloatingButton();
		placement = 'top-end';
		document.body.appendChild(btnEl);
	}
	btnLabel = btnEl.querySelector<HTMLElement>('[data-label]');
	decorate(btnEl);
	const popupController = controller();
	updateButtonLabel();
	// An open popup is anchored to the old, detached button; re-anchor it.
	if (popupController.isOpen()) popupController.open(btnEl, placement);
	watchButton();
	return btnEl;
}

/**
 * Show or update the download info. `loading` clears the current info so an
 * open popup shows its loading state until the real data arrives.
 */
export function showDownloadInfo(info: DisplayInfo, loading = false): void {
	logInfo(MODULE, 'showDownloadInfo', {
		code: info.code,
		title: info.title,
		quality: info.quality,
		hasDash: !!info.dash,
		hasDurl: !!info.durl,
		loading
	});
	controller().setInfo(loading ? null : info);
	if (!loading) ensureButton();
}

/** Log to the console and to the popup's log panel. */
export function log(...args: unknown[]): void {
	console.log('[bilibili downloader]', '[host]', ...args);
	controller().appendLog(args.map((a) => (typeof a === 'object' ? safeJson(a) : String(a))).join(' '));
}

function safeJson(a: unknown): string {
	try {
		return JSON.stringify(a);
	} catch {
		return String(a);
	}
}

export function clearLogs(): void {
	logInfo(MODULE, 'logs cleared');
	popup?.clearLogs();
}

/** Remove the button and popup, and release any saved-file object URLs. */
export function cleanup(): void {
	observer?.disconnect();
	observer = null;
	restoreQueued = false;
	popup?.destroy();
	tasks?.dispose();
	popup = null;
	tasks = null;
	btnEl?.remove();
	btnEl = null;
	btnLabel = null;
}
