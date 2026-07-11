/**
 * Host UI for the Bilibili download helper.
 *
 * Injects a download button into the Bilibili page toolbar (next to the share button)
 * instead of the old floating bottom bar. A small popup panel shows download links
 * on click.
 */

import { HOST_ELEMENT_ID, QUALITY_LABELS } from './constants';
import { getInternals, isAdvancedMode, isMergeMode, formatSize } from './utils';
import { ErrorCode } from './schemas';
import type { PlayUrlResult } from './bilibili-api';
import type { DurlSegment, DashStream } from './schemas';
import {
	createNormalDownloadLink,
	createAdvancedNoMergeLinks,
	createMergeLink,
	downloadSingle,
	downloadAndMerge
} from './download';
import { logInfo, logWarn, logError } from './logger';

const MODULE = 'host';

export interface DisplayInfo {
	code: number;
	title?: string;
	quality?: string;
	message?: string;
	dash?: { audio: DashStream; video: DashStream };
	durl?: DurlSegment[];
}

let cachedInfo: DisplayInfo | null = null;
let popupEl: HTMLElement | null = null;
let btnEl: HTMLElement | null = null;

const DOWNLOAD_BTN_ID = 'bilibili-helper-download-btn';

/**
 * Remove the old floating bottom bar if it still exists from a previous version.
 */
function cleanupOldHost(): void {
	const old = document.getElementById('bilibili-helper-host');
	if (old) {
		old.remove();
		logInfo(MODULE, 'removed old floating host bar');
	}
}

/**
 * Inject a download button into the page toolbar after the share button.
 * Creates the popup panel lazily on first click.
 */
function ensureButton(): HTMLElement {
	if (btnEl) return btnEl;

	// Nuke the old floating bar
	cleanupOldHost();

	// Find the share button wrapper — insert after it
	const shareWrap = document.querySelector('.toolbar-left-item-wrap .video-share-wrap');
	if (!shareWrap) {
		logWarn(MODULE, 'share button not found, using fallback popup position');
		// Fallback: create a fixed floating button
		btnEl = document.createElement('div');
		btnEl.id = DOWNLOAD_BTN_ID;
		btnEl.textContent = '下载';
		Object.assign(btnEl.style, {
			position: 'fixed',
			bottom: '20px',
			right: '20px',
			zIndex: '999999',
			background: '#f45a8d',
			color: '#fff',
			padding: '10px 20px',
			borderRadius: '6px',
			cursor: 'pointer',
			fontSize: '14px',
			fontWeight: 'bold',
			boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
		});
		document.body.appendChild(btnEl);
		btnEl.addEventListener('click', togglePopup);
		return btnEl;
	}

	// Insert download button right after the share button's parent toolbar-left-item-wrap
	const shareItem = shareWrap.closest('.toolbar-left-item-wrap');
	if (!shareItem || !shareItem.parentNode) {
		logWarn(MODULE, 'share item parent not found');
		return btnEl!;
	}

	btnEl = document.createElement('div');
	btnEl.id = DOWNLOAD_BTN_ID;
	btnEl.className = 'toolbar-left-item-wrap';
	btnEl.style.cssText = 'display:inline-flex;align-items:center;cursor:pointer;';
	btnEl.innerHTML = `
		<div class="video-toolbar-left-item" style="display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--text1,#18191C);font-size:12px">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4h3.66V9h3.84L12 2z" fill="currentColor"/>
			</svg>
			<span>下载</span>
		</div>
	`;
	btnEl.addEventListener('click', togglePopup);
	shareItem.parentNode.insertBefore(btnEl, shareItem.nextSibling);
	logInfo(MODULE, 'download button injected after share button');
	return btnEl;
}

function togglePopup(): void {
	if (popupEl) {
		popupEl.remove();
		popupEl = null;
		return;
	}
	showPopup();
}

function showPopup(): void {
	if (popupEl) {
		popupEl.remove();
		popupEl = null;
	}
	if (!cachedInfo) {
		logInfo(MODULE, 'no download info yet, cannot show popup');
		return;
	}

	popupEl = document.createElement('div');
	popupEl.id = 'bilibili-helper-popup';
	Object.assign(popupEl.style, {
		position: 'fixed',
		zIndex: '999999',
		bottom: '20px',
		right: '20px',
		width: '420px',
		maxHeight: '70vh',
		overflowY: 'auto',
		background: '#fff',
		border: '1px solid #e3e5e7',
		borderRadius: '8px',
		boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
		padding: '16px 20px',
		fontSize: '13px',
		color: '#18191C',
		lineHeight: '1.5'
	});

	const info = cachedInfo;
	const title = info.title || 'Untitled';
	const qual = info.quality ? `[${info.quality}]` : '';

	popupEl.innerHTML = `
		<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
			<strong>${qual} ${escapeHtml(title)}</strong>
			<button id="bilibili-helper-popup-close" style="border:none;background:none;cursor:pointer;font-size:18px;color:#999;padding:0 4px">&times;</button>
		</div>
		<div id="bilibili-helper-popup-links" style="margin-bottom:8px">
			${linksHtml(info)}
		</div>
		<div style="border-top:1px solid #f1f2f3;padding-top:8px;margin-top:4px;font-size:12px;color:#9499A0">
			<label style="margin-right:12px"><input type="radio" name="helper-dl-mode" value="advanced" ${isAdvancedMode() ? 'checked' : ''}> Advanced</label>
			<label style="margin-right:12px"><input type="radio" name="helper-dl-mode" value="normal" ${!isAdvancedMode() ? 'checked' : ''}> Normal</label>
			<label id="helper-merge-label" style="margin-right:12px;${!isDash(info) ? 'display:none' : ''}">
				<input type="checkbox" id="helper-merge-cb" ${isMergeMode() ? 'checked' : ''}> Merge
			</label>
		</div>
		<div id="bilibili-helper-popup-logs" style="margin-top:8px;background:#2d2d2d;color:#9ab45a;border-radius:4px;padding:8px;font-size:11px;max-height:200px;overflow-y:auto;word-break:break-all"></div>
	`;

	document.body.appendChild(popupEl);

	popupEl.querySelector('#bilibili-helper-popup-close')!.addEventListener('click', () => {
		popupEl?.remove();
		popupEl = null;
	});

	// Wire settings changes
	popupEl.querySelectorAll('input[name="helper-dl-mode"]').forEach((el) => {
		el.addEventListener('change', () => {
			const val = (el as HTMLInputElement).value;
			localStorage.bilibili_helper_download_mode = val;
			rebuildPopupLinks();
		});
	});
	const mergeCb = popupEl.querySelector('#helper-merge-cb') as HTMLInputElement;
	if (mergeCb) {
		mergeCb.addEventListener('change', () => {
			localStorage.bilibili_helper_merge_mode = mergeCb.checked ? 'on' : 'off';
			rebuildPopupLinks();
		});
	}

	// Wire download clicks
	popupEl.querySelector('#bilibili-helper-popup-links')!.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		if (target.tagName.toLowerCase() !== 'a') return;
		const anchor = target as HTMLAnchorElement;
		if (anchor.classList.contains('disabled')) return;
		e.preventDefault();
		e.stopPropagation();

		const filename = anchor.getAttribute('title') ?? 'download';
		const logsEl = popupEl?.querySelector('#bilibili-helper-popup-logs');

		if (anchor.getAttribute('merge') === 'on') {
			const durlsAttr = anchor.getAttribute('durls');
			if (!durlsAttr) return;
			const segments: Array<{ url: string; size?: number }> = JSON.parse(decodeURIComponent(durlsAttr));
			appendLog(logsEl, `merging ${filename}...`);
			downloadAndMerge(anchor, segments, filename, logsEl!).catch((err) => {
				appendLog(logsEl, `merge failed: ${err}`);
			});
		} else {
			const durlAttr = anchor.getAttribute('durl');
			if (!durlAttr) return;
			const segment: { url: string; size?: number } = JSON.parse(decodeURIComponent(durlAttr));
			appendLog(logsEl, `downloading ${filename}...`);
			downloadSingle(anchor, segment, filename, logsEl!).catch((err) => {
				appendLog(logsEl, `download failed: ${err}`);
			});
		}
	});
}

function isDash(info: DisplayInfo): boolean {
	return !!info.dash;
}

function rebuildPopupLinks(): void {
	const linksEl = popupEl?.querySelector('#bilibili-helper-popup-links');
	if (!linksEl || !cachedInfo) return;
	linksEl.innerHTML = linksHtml(cachedInfo);
	// Re-attach merge label visibility
	const mergeLabel = popupEl?.querySelector('#helper-merge-label') as HTMLElement;
	if (mergeLabel) {
		mergeLabel.style.display = isDash(cachedInfo) ? '' : 'none';
	}
}

function appendLog(el: HTMLElement | null, msg: string): void {
	if (!el) return;
	el.innerHTML += `<div>${escapeHtml(msg)}</div>`;
	el.scrollTop = el.scrollHeight;
}

function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function linksHtml(info: DisplayInfo): string {
	if (info.code !== ErrorCode.OK) return `<div style="color:#f85a54">${escapeHtml(info.message || 'Unknown error')}</div>`;
	const isDash = !!info.dash;
	const segments: Array<{ url: string; size?: number }> = [];
	if (isDash && info.dash) {
		segments.push(
			{ url: info.dash.audio.base_url ?? info.dash.audio.baseUrl ?? '', size: info.dash.audio.size },
			{ url: info.dash.video.base_url ?? info.dash.video.baseUrl ?? '', size: info.dash.video.size }
		);
	} else if (info.durl) {
		segments.push(...info.durl);
	}

	const title = info.title ?? '';

	if (!isAdvancedMode()) {
		return createNormalDownloadLink(title, segments, isDash);
	}
	if (!isMergeMode() || !isDash) {
		return createAdvancedNoMergeLinks(segments, title, isDash);
	}
	return createMergeLink(segments, title);
}

/**
 * Show or update the download info. If the button doesn't exist yet, inject it.
 */
export function showDownloadInfo(info: DisplayInfo, loading = false): void {
	logInfo(MODULE, 'showDownloadInfo', { code: info.code, title: info.title, quality: info.quality, hasDash: !!info.dash, hasDurl: !!info.durl, loading });

	if (loading) {
		// Don't show loading state — just cache and wait for the real data
		cachedInfo = null;
		return;
	}

	cachedInfo = info;

	// Inject the button into the toolbar
	ensureButton();

	// If popup is already open, update its contents
	if (popupEl) {
		rebuildPopupLinks();
	}
}

/**
 * Append a log message to the console (and popup if open).
 */
export function log(...args: unknown[]): void {
	const ns = '[bilibili downloader]';
	console.log(ns, '[host]', ...args);
	// Also append to open popup
	const logsEl = popupEl?.querySelector('#bilibili-helper-popup-logs');
	if (logsEl) {
		const line = args.map((a) => (typeof a === 'object' ? safeJson(a) : String(a))).join(' ');
		logsEl.innerHTML += `<div>${escapeHtml(line)}</div>`;
		logsEl.scrollTop = logsEl.scrollHeight;
	}
}

function safeJson(a: unknown): string {
	try {
		return JSON.stringify(a);
	} catch {
		return String(a);
	}
}

/**
 * Clear log panel.
 */
export function clearLogs(): void {
	logInfo(MODULE, 'logs cleared');
	const logsEl = popupEl?.querySelector('#bilibili-helper-popup-logs');
	if (logsEl) logsEl.innerHTML = '';
}

/**
 * Remove the download button and popup from the page.
 */
export function cleanup(): void {
	btnEl?.remove();
	btnEl = null;
	popupEl?.remove();
	popupEl = null;
	cachedInfo = null;
}