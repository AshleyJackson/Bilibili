import { HOST_ELEMENT_ID, QUALITY_LABELS } from './constants';
import { SHADOW_STYLES, SETTINGS_HTML, LOADING_SPINNER, getReviewUrl } from './ui';
import { getInternals, isHidden, isAdvancedMode, isMergeMode, formatSize } from './utils';
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

let shadowRoot: ShadowRoot | null = null;
let hostElement: HTMLElement | null = null;

function titleHtml(info: DisplayInfo): string {
	if (info.code !== ErrorCode.OK) return `<strong>${info.message ?? '未知错误'}</strong>`;
	const qual = info.quality ? `[${info.quality}] ` : '';
	if (info.dash || info.durl) {
		return `${qual}<strong>${info.title}</strong> 的下载地址：`;
	}
	return `<strong>出错了:( ${info.message ?? '未知错误'}</strong>`;
}

function linksHtml(info: DisplayInfo): string {
	if (info.code !== ErrorCode.OK) return '';
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

function setupSettings(shadow: ShadowRoot, buildLinks: () => void): void {
	const advanced = shadow.getElementById('setting-download-mode-advanced') as HTMLInputElement;
	const normal = shadow.getElementById('setting-download-mode-normal') as HTMLInputElement;
	const mergeOn = shadow.getElementById('setting-merge-on') as HTMLInputElement;
	const mergeOff = shadow.getElementById('setting-merge-off') as HTMLInputElement;
	const advancedSettings = shadow.getElementById('setting-advanced') as HTMLElement;
	const durlsEl = shadow.getElementById('durls') as HTMLElement;
	const toggle = shadow.getElementById('toggle') as HTMLElement;
	const content = shadow.getElementById('content') as HTMLElement;
	const contentHost = document.getElementById(HOST_ELEMENT_ID);
	const actions = shadow.getElementById('actions') as HTMLElement;

	const disable = (): void => {
		advanced.disabled = true;
		normal.disabled = true;
		mergeOn.disabled = true;
		mergeOff.disabled = true;
	};

	const enable = (): void => {
		advanced.disabled = false;
		normal.disabled = false;
		mergeOn.disabled = false;
		mergeOff.disabled = false;
	};

	if (isAdvancedMode()) {
		advanced.checked = true;
		advancedSettings.style.display = 'block';
	} else {
		normal.checked = true;
		advancedSettings.style.display = 'none';
	}

	if (isMergeMode()) {
		mergeOn.checked = true;
	} else {
		mergeOff.checked = true;
	}

	advanced.addEventListener('change', () => {
		logInfo(MODULE, 'setting changed: download mode -> advanced');
		localStorage.bilibili_helper_download_mode = 'advanced';
		advancedSettings.style.display = 'block';
		buildLinks();
	});

	normal.addEventListener('change', () => {
		logInfo(MODULE, 'setting changed: download mode -> normal');
		localStorage.bilibili_helper_download_mode = 'normal';
		advancedSettings.style.display = 'none';
		buildLinks();
	});

	mergeOn.addEventListener('change', () => {
		logInfo(MODULE, 'setting changed: merge mode -> on');
		localStorage.bilibili_helper_merge_mode = 'on';
		buildLinks();
	});

	mergeOff.addEventListener('change', () => {
		logInfo(MODULE, 'setting changed: merge mode -> off');
		localStorage.bilibili_helper_merge_mode = 'off';
		buildLinks();
	});

	durlsEl.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		if (target.tagName.toLowerCase() !== 'a') return;
		const anchor = target as HTMLAnchorElement;
		if (anchor.getAttribute('mode') !== 'advanced') return;
		if (anchor.classList.contains('disabled')) return;

		e.preventDefault();
		e.stopPropagation();

		const filename = anchor.getAttribute('title') ?? 'download';

		if (anchor.getAttribute('merge') === 'on') {
			logInfo(MODULE, 'download click: merge mode', { filename });
			const durlsAttr = anchor.getAttribute('durls');
			if (!durlsAttr) return;
			const progressEl = shadow.querySelector(`ul[durls="${CSS.escape(durlsAttr)}"]`) as HTMLElement;
			const segments: Array<{ url: string; size?: number }> = JSON.parse(decodeURIComponent(durlsAttr));
			disable();
			downloadAndMerge(anchor, segments, filename, progressEl).then(enable).catch((err) => {
				logError(MODULE, 'downloadAndMerge failed', err);
				enable();
			});
		} else {
			logInfo(MODULE, 'download click: single mode', { filename });
			const durlAttr = anchor.getAttribute('durl');
			if (!durlAttr) return;
			const progressEl = shadow.querySelector(`span[durl="${CSS.escape(durlAttr)}"]`) as HTMLElement;
			const segment: { url: string; size?: number } = JSON.parse(decodeURIComponent(durlAttr));
			disable();
			downloadSingle(anchor, segment, filename, progressEl).then(enable).catch((err) => {
				logError(MODULE, 'downloadSingle failed', err);
				enable();
			});
		}
	});

	toggle.addEventListener('click', () => {
		if (isHidden()) {
			logInfo(MODULE, 'toggle: show UI');
			localStorage.bilibili_helper_show = 'show';
			content.classList.remove('hide');
			toggle.innerHTML = '收起';
			contentHost?.classList.remove('hide');
			actions.style.top = '0';
			const notice = shadow.getElementById('notice-frame') as HTMLIFrameElement;
			notice?.contentWindow?.postMessage({ action: 'getHeight' }, 'https://csser.top');
		} else {
			logInfo(MODULE, 'toggle: hide UI');
			localStorage.bilibili_helper_show = 'hide';
			content.classList.add('hide');
			contentHost?.classList.add('hide');
			toggle.innerHTML = '打开B站下载助手';
			actions.style.top = '0';
		}
	});

	if (contentHost) {
		contentHost.addEventListener('scroll', () => {
			actions.style.top = contentHost.scrollTop + 'px';
		});
	}
}

function setupNotice(shadow: ShadowRoot): void {
	const iframe = shadow.getElementById('notice-frame') as HTMLIFrameElement;
	if (!iframe) return;

	iframe.onload = () => {
		logInfo(MODULE, 'notice iframe loaded');
		iframe.contentWindow?.postMessage({ action: 'getHeight' }, 'https://csser.top');
		const internals = getInternals();
		iframe.contentWindow?.postMessage(
			{ action: 'setVersion', version: { name: internals.name, code: parseInt(internals.version.replace(/\./g, ''), 10) } },
			'https://csser.top'
		);
		iframe.contentWindow?.postMessage({ action: 'setTheme', theme: 'null' }, 'https://csser.top');
	};

	window.addEventListener('message', (e) => {
		if (e.origin !== 'https://csser.top' || !e.data) return;
		if (e.data.action === 'reportHeight') {
			iframe.style.height = (e.data.height + 10) + 'px';
		}
	});

	iframe.src = `https://csser.top/bilibili/notice.html?t=${Date.now()}`;

	window.addEventListener('resize', () => {
		iframe.contentWindow?.postMessage({ action: 'getHeight' }, 'https://csser.top');
	});
}

/**
 * Update or create the host UI element with the given download info.
 */
export function showDownloadInfo(info: DisplayInfo, loading = false): void {
	logInfo(MODULE, 'showDownloadInfo', { code: info.code, title: info.title, quality: info.quality, hasDash: !!info.dash, hasDurl: !!info.durl, loading });
	const el = document.getElementById(HOST_ELEMENT_ID);
	const hostStyles = `display:block;overflow:auto;position:fixed;z-index:${Number.MAX_SAFE_INTEGER};bottom:0;left:0;right:0;max-height:50%;width:100%;background: #fff;border-top: 1px solid #ccc;box-shadow: rgba(0, 0, 0, 0.2) 0 -5px 10px;`;

	if (el) {
		// Update existing host
		shadowRoot = el.shadowRoot!;
		const titleEl = shadowRoot.getElementById('title')!;
		titleEl.innerHTML = loading ? '加载中' + LOADING_SPINNER : titleHtml(info);

		const durlsEl = shadowRoot.getElementById('durls')!;
		durlsEl.innerHTML = loading ? '' : linksHtml(info);

		const styleEl = shadowRoot.getElementById('d-style')!;
		styleEl.textContent = !info.dash && info.durl ? '#setting-advanced{display:none!important}' : '';
	} else {
		// Create host element
		hostElement = document.createElement('div');
		hostElement.id = HOST_ELEMENT_ID;
		hostElement.style.cssText = hostStyles;
		if (isHidden()) hostElement.classList.add('hide');
		document.body.appendChild(hostElement);

		shadowRoot = hostElement.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = `
      <style>${SHADOW_STYLES}
        #${CSS.escape(HOST_ELEMENT_ID)}.hide{
          width:auto!important;
          left:auto!important;
          background:transparent!important;
          border:0 none!important;
          border-radius: 6px 0 0 0;
          box-shadow: rgba(0, 0, 0, 0.2) -5px -5px 10px!important;
        }
        .player-fullscreen-fix #${CSS.escape(HOST_ELEMENT_ID)} {
          z-index: 9!important;
        }
      </style>
      <div id="content" ${isHidden() ? 'class="hide"' : ''}>
        <div id="side-bar">
          <div class="notice">
            <iframe id="notice-frame" frameborder="0"></iframe>
          </div>
        </div>
        <div id="main">
          <style id="d-style">${!info.dash && info.durl ? '#setting-advanced{display:none!important}' : ''}</style>
          ${SETTINGS_HTML}
          <h3 id="title">${loading ? '加载中' + LOADING_SPINNER : titleHtml(info)}</h3>
          <ul id="durls">
            ${loading ? '' : linksHtml(info)}
          </ul>
          <div class="beg">
            <p>
              如果这个工具确实帮到了您，烦请给个五星好评，谢谢😊
              <a class="btn" href="${getReviewUrl()}" target="_blank">去评价</a>
            </p>
          </div>
          <div id="bilibliHelperLogs">
            <h4>解析日志：</h4>
          </div>
        </div>
        <div id="actions">
          <button id="toggle" class="btn-large">${isHidden() ? '打开B站下载助手' : '收起'}</button>
        </div>
      </div>
    `;

		setupSettings(shadowRoot, () => {
			const durlsEl = shadowRoot!.getElementById('durls')!;
			durlsEl.innerHTML = linksHtml(info);
		});
		setupNotice(shadowRoot);
	}
}

/**
 * Append a log message to the host UI's log panel.
 */
export function log(...args: unknown[]): void {
	const ns = '[bilibili downloader]';
	console.log(ns, '[host]', ...args);
	try {
		const el = document.getElementById(HOST_ELEMENT_ID);
		if (!el) return;
		const logs = el.shadowRoot?.querySelector('#bilibliHelperLogs');
		if (!logs) return;

		const line = args
			.map((a) => {
				if (typeof a === 'object') {
					try {
						return JSON.stringify(a);
					} catch {
						return String(a);
					}
				}
				return String(a);
			})
			.join(' ');
		logs.innerHTML += `<p>${line}</p>`;
	} catch {
		// Silently ignore if DOM not ready
	}
}

/**
 * Clear log panel.
 */
export function clearLogs(): void {
	logInfo(MODULE, 'logs cleared');
	const el = document.getElementById(HOST_ELEMENT_ID);
	if (!el) return;
	const logs = el.shadowRoot?.querySelector('#bilibliHelperLogs');
	if (logs) logs.innerHTML = '';
}