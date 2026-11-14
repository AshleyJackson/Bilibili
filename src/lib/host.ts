/**
 * Host UI for the Bilibili download helper.
 *
 * Injects a download button into the Bilibili page toolbar (next to the share button)
 * instead of the old floating bottom bar. A small popup panel shows download links
 * on click.
 */

import { isAdvancedMode, isMergeMode, downloadBlob } from './utils';
import { ErrorCode } from './schemas';
import type { DurlSegment, DashStream } from './schemas';
import {
	createNormalDownloadLink,
	createAdvancedNoMergeLinks,
	createMergeLink,
	type LinkSegment
} from './download';
import {
	downloadStream,
	downloadAndMerge as downloadAndMergeStreams,
	extensionForUrl,
	type SegmentDescriptor
} from './downloader/orchestration';
import { logInfo, logWarn } from './logger';

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

	// Find the share button wrapper -- insert after it
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
			<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="video-toolbar-item-icon" fill="currentColor">
				<path d="M23 17v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5h2v5h14v-5h2z"/>
				<path d="M14 4a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L13 14.586V5a1 1 0 0 1 1-1z"/>
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

		// Normal-mode links: intercept because CDN URLs are cross-origin.
		// Download programmatically via stream fetch.
		if (anchor.getAttribute('mode') !== 'advanced') {
			const title = anchor.getAttribute('title') ?? 'download';
			const logsEl = (popupEl?.querySelector('#bilibili-helper-popup-logs') as HTMLElement | null) ?? null;
			e.preventDefault();
			e.stopPropagation();

			// Build a LinkSegment from the href and parse any sibling size text
			const seg: LinkSegment = {
				url: anchor.getAttribute('href') ?? '',
				backups: [],
				size: anchor.parentElement?.querySelector('.size')?.textContent
					? parseSize(anchor.parentElement.querySelector('.size')!.textContent!)
					: undefined
			};
			if (seg.url) {
				appendLog(logsEl, `downloading ${title}...`);
				runSingle(anchor, seg, title, logsEl!).catch((err) => {
					appendLog(logsEl, `download failed: ${err}`);
				});
			}
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		const filename = anchor.getAttribute('title') ?? 'download';
		const logsEl = (popupEl?.querySelector('#bilibili-helper-popup-logs') as HTMLElement | null) ?? null;

		if (anchor.getAttribute('merge') === 'on') {
			const durlsAttr = anchor.getAttribute('durls');
			if (!durlsAttr) return;
			const segments: LinkSegment[] = JSON.parse(decodeURIComponent(durlsAttr));
			appendLog(logsEl, `merging ${filename}...`);
			runMerge(anchor, segments, filename, logsEl!).catch((err) => {
				appendLog(logsEl, `merge failed: ${err}`);
			});
		} else {
			const durlAttr = anchor.getAttribute('durl');
			if (!durlAttr) return;
			const segments: LinkSegment[] = JSON.parse(decodeURIComponent(durlAttr));
			appendLog(logsEl, `downloading ${filename}...`);
			runSingle(anchor, segments[0], filename, logsEl!).catch((err) => {
				appendLog(logsEl, `download failed: ${err}`);
			});
		}
	});
}

function isDash(info: DisplayInfo): boolean {
	return !!info.dash;
}

/** Convert a LinkSegment (primary + backups) to the downloader's SegmentDescriptor. */
function toDescriptor(seg: LinkSegment): SegmentDescriptor {
	return { url: seg.url, backups: seg.backups, size: seg.size };
}

/** Run a single-segment download with progress, then trigger the browser save. */
async function runSingle(
	anchor: HTMLAnchorElement,
	seg: LinkSegment,
	filename: string,
	logsEl: HTMLElement
): Promise<void> {
	anchor.classList.add('disabled');
	const progressEl = anchor.parentElement?.querySelector('.progress') as HTMLElement | null;
	try {
		const blob = await downloadStream(toDescriptor(seg), (received, total) => {
			const pct = total > 0 ? Math.round((received / total) * 100) : 0;
			progressEl?.replaceChildren(document.createTextNode(` downloading ${pct}%`));
		});
		const ext = extensionForUrl(seg.url);
		progressEl?.replaceChildren(document.createTextNode(' download complete'));
		appendLog(logsEl, `downloaded ${filename}${ext}`);
		downloadBlob(new Uint8Array(await blob.arrayBuffer()), filename + ext, logsEl);
	} finally {
		anchor.classList.remove('disabled');
	}
}

/** Run a parallel audio+video download + FFmpeg merge. */
async function runMerge(
	anchor: HTMLAnchorElement,
	segments: LinkSegment[],
	filename: string,
	logsEl: HTMLElement
): Promise<void> {
	anchor.classList.add('disabled');
	const progressEl = anchor.parentElement?.querySelector('.progress') as HTMLElement | null;
	const audioEl = document.createElement('li');
	const videoEl = document.createElement('li');
	if (progressEl) {
		progressEl.append(audioEl, videoEl);
	}
	const fmt = (which: 'audio' | 'video'): void => {
		audioEl.replaceChildren(document.createTextNode('audio downloading'));
		videoEl.replaceChildren(document.createTextNode('video downloading'));
	};
	fmt('audio');
	try {
		const { data, cleanup } = await downloadAndMergeStreams(
			{
				audio: toDescriptor(segments[0]),
				video: toDescriptor(segments[1])
			},
			(which, received, total) => {
				const pct = total > 0 ? Math.round((received / total) * 100) : 0;
				(which === 'audio' ? audioEl : videoEl).replaceChildren(
					document.createTextNode(`${which} downloading ${pct}%`)
				);
			}
		);
		progressEl?.replaceChildren(document.createTextNode('done'));
		appendLog(logsEl, `merged ${filename}.mp4`);
		downloadBlob(new Uint8Array(data), `${filename}.mp4`, logsEl, cleanup);
	} finally {
		anchor.classList.remove('disabled');
	}
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

/** Parse a human-readable size string like '12.34MB' or '5.67GB' back to bytes. */
function parseSize(text: string | null | undefined): number | undefined {
	if (!text) return undefined;
	const m = text.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
	if (!m) return undefined;
	const num = parseFloat(m[1]);
	switch (m[2].toUpperCase()) {
		case 'GB': return num * 1024 * 1024 * 1024;
		case 'MB': return num * 1024 * 1024;
		case 'KB': return num * 1024;
		default: return num;
	}
}

function linksHtml(info: DisplayInfo): string {
	if (info.code !== ErrorCode.OK) return `<div style="color:#f85a54">${escapeHtml(info.message || 'Unknown error')}</div>`;
	const isDash = !!info.dash;
	const segments: LinkSegment[] = [];
	if (isDash && info.dash) {
		segments.push(streamToLinkSegment(info.dash.audio), streamToLinkSegment(info.dash.video));
	} else if (info.durl) {
		for (const seg of info.durl) {
			segments.push({ url: seg.url, backups: seg.backup_url, size: seg.size });
		}
	}

	const title = info.title ?? '';
	const opts = { filename: title, segments, isDash };

	if (!isAdvancedMode()) {
		return createNormalDownloadLink(opts);
	}
	if (!isMergeMode() || !isDash) {
		return createAdvancedNoMergeLinks(opts);
	}
	return createMergeLink(opts);
}

/** Map a DashStream to a LinkSegment, pulling primary + backup URLs. */
function streamToLinkSegment(stream: DashStream): LinkSegment {
	const primary = stream.base_url ?? stream.baseUrl ?? '';
	const backups = stream.backup_url ?? stream.backupUrl ?? [];
	return { url: primary, backups: backups.filter(Boolean), size: stream.size };
}

/**
 * Show or update the download info. If the button doesn't exist yet, inject it.
 */
export function showDownloadInfo(info: DisplayInfo, loading = false): void {
	logInfo(MODULE, 'showDownloadInfo', { code: info.code, title: info.title, quality: info.quality, hasDash: !!info.dash, hasDurl: !!info.durl, loading });

	if (loading) {
		// Don't show loading state -- just cache and wait for the real data
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
