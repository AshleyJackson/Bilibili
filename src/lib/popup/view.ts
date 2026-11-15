/**
 * DOM builders for the download popup. Every function returns fresh nodes built
 * with createElement/textContent, so titles and URLs never pass through HTML
 * parsing. Interactive elements carry `data-action` (and `data-id` for rows);
 * the controller handles them by event delegation.
 */

import { ErrorCode } from '../schemas';
import { formatSize } from '../utils';
import { describeStreams, type DisplayInfo, type DownloadOption } from '../download';
import type { TaskState } from './tasks';
import { ICONS, type IconName } from './icons';

type Child = Node | string | null | undefined | false;
type Attrs = Record<string, string | boolean | undefined>;

export function h(tag: string, attrs: Attrs = {}, ...children: Child[]): HTMLElement {
	const el = document.createElement(tag);
	for (const [name, value] of Object.entries(attrs)) {
		if (value === undefined || value === false) continue;
		el.setAttribute(name, value === true ? '' : value);
	}
	for (const child of children) {
		if (child === null || child === undefined || child === false) continue;
		el.append(child);
	}
	return el;
}

export function icon(name: IconName): HTMLElement {
	const wrap = document.createElement('span');
	wrap.style.display = 'contents';
	// Static, trusted SVG markup from ICONS; never user data.
	wrap.innerHTML = ICONS[name];
	return wrap;
}

function joinFacts(facts: Array<string | undefined | false>): string {
	return facts.filter(Boolean).join(' · ');
}

function knownSize(bytes: number | undefined): string | undefined {
	return bytes ? formatSize(bytes) : undefined;
}

function headerTitle(info: DisplayInfo | null): string {
	if (!info) return '正在获取视频信息';
	if (info.title) return info.title;
	return info.code === ErrorCode.OK ? '未命名视频' : '无法获取下载地址';
}

export function renderHeader(info: DisplayInfo | null): HTMLElement {
	const chips = info ? [info.quality, ...describeStreams(info)].filter((c): c is string => !!c) : [];
	return h(
		'div',
		{ class: 'head' },
		h(
			'div',
			{ class: 'heading' },
			h('p', { class: 'eyebrow' }, icon('download'), '下载视频'),
			h('h2', { class: 'title', id: 'bh-title', title: info?.title }, headerTitle(info)),
			chips.length > 0 &&
				h(
					'div',
					{ class: 'chips' },
					...chips.map((c, i) => h('span', { class: i === 0 && info?.quality ? 'chip quality' : 'chip' }, c))
				)
		),
		h(
			'button',
			{ class: 'icon-btn', type: 'button', 'data-action': 'close', title: '关闭', 'aria-label': '关闭' },
			icon('close')
		)
	);
}

const KIND_ICON: Record<DownloadOption['kind'], IconName> = {
	merged: 'film',
	file: 'film',
	video: 'image',
	audio: 'music'
};

function formatSpeed(received: number, startedAt: number, now: number): string | undefined {
	const seconds = (now - startedAt) / 1000;
	if (seconds < 1 || received <= 0) return undefined;
	return `${formatSize(received / seconds)}/s`;
}

export function renderRow(
	option: DownloadOption,
	state: TaskState | undefined,
	now: number,
	index: number
): HTMLElement {
	const status = state?.status ?? 'idle';
	const tileIcon: IconName = status === 'done' ? 'check' : status === 'error' ? 'alert' : KIND_ICON[option.kind];
	const labelId = `bh-option-${index}`;

	let percent: string | undefined;
	let line2: string;
	let bar: HTMLElement | null = null;
	const actions: HTMLElement[] = [];

	switch (state?.status) {
		case 'downloading': {
			const pct = state.total > 0 ? Math.min(100, Math.floor((state.received / state.total) * 100)) : null;
			percent = pct === null ? undefined : `${pct}%`;
			const amount =
				state.received <= 0
					? '正在连接…'
					: state.total > 0
						? `${formatSize(state.received)} / ${formatSize(state.total)}`
						: formatSize(state.received);
			line2 = joinFacts([amount, formatSpeed(state.received, state.startedAt, now)]);
			bar = h(
				'div',
				{
					class: pct === null ? 'bar indeterminate' : 'bar',
					role: 'progressbar',
					'aria-labelledby': labelId,
					'aria-valuemin': '0',
					'aria-valuemax': '100',
					'aria-valuenow': pct === null ? undefined : String(pct)
				},
				h('span', { style: pct === null ? undefined : `width:${pct}%` })
			);
			break;
		}
		case 'merging':
			line2 = '正在合并画面与声音…';
			bar = h('div', { class: 'bar indeterminate', role: 'progressbar', 'aria-labelledby': labelId }, h('span'));
			break;
		case 'done':
			line2 = joinFacts(['已保存', option.format, knownSize(state.size)]);
			actions.push(
				h('a', { class: 'btn', href: state.url, download: option.filename, title: option.filename }, '再次保存')
			);
			break;
		case 'error':
			line2 = `下载失败：${state.message}`;
			actions.push(
				h(
					'button',
					{ class: 'btn', type: 'button', 'data-action': 'download', 'data-id': option.id },
					icon('retry'),
					'重试'
				)
			);
			break;
		default:
			line2 = joinFacts([option.format, option.detail, knownSize(option.size)]);
			if (option.kind !== 'merged') {
				actions.push(
					h(
						'button',
						{
							class: 'icon-btn',
							type: 'button',
							'data-action': 'copy',
							'data-id': option.id,
							title: '复制直链',
							'aria-label': `复制${option.label}直链`
						},
						icon('link')
					)
				);
			}
			actions.push(
				h(
					'button',
					{
						class: option.recommended ? 'btn primary' : 'btn',
						type: 'button',
						'data-action': 'download',
						'data-id': option.id,
						'aria-label': `下载${option.label}`
					},
					icon('download'),
					'下载'
				)
			);
	}

	return h(
		'li',
		{ class: 'row', 'data-row': option.id, 'data-status': status, 'data-recommended': option.recommended },
		h('span', { class: 'tile' }, icon(tileIcon)),
		h(
			'div',
			{ class: 'main' },
			h(
				'div',
				{ class: 'line1' },
				h('span', { id: labelId }, option.label),
				option.recommended && status === 'idle' && h('span', { class: 'badge' }, '推荐'),
				percent && h('span', { class: 'percent' }, percent)
			),
			bar,
			h('div', { class: 'line2', title: line2 }, line2)
		),
		actions.length > 0 && h('div', { class: 'actions' }, ...actions)
	);
}

export function renderBody(info: DisplayInfo | null, rows: HTMLElement[]): HTMLElement {
	if (!info) {
		return h(
			'div',
			{ class: 'body' },
			h('div', { class: 'state', role: 'status' }, h('div', { class: 'spinner' }), '正在解析视频地址…')
		);
	}
	if (info.code !== ErrorCode.OK || rows.length === 0) {
		return h(
			'div',
			{ class: 'body' },
			h(
				'div',
				{ class: 'state error', role: 'alert' },
				icon('alert'),
				h('strong', {}, info.message || '没有找到可下载的视频流'),
				'可以尝试刷新页面、登录账号，或在播放器中切换清晰度后重试'
			)
		);
	}
	return h('div', { class: 'body' }, h('ul', { class: 'options', 'aria-label': '下载选项' }, ...rows));
}

export function renderFooter(logCount: number, logsOpen: boolean): HTMLElement {
	return h(
		'div',
		{ class: 'foot' },
		h('span', { class: 'hint' }, icon('info'), '清晰度跟随播放器，切换后自动更新'),
		h(
			'button',
			{
				class: 'text-btn',
				type: 'button',
				'data-action': 'toggle-logs',
				'aria-expanded': String(logsOpen),
				'aria-controls': 'bh-logs'
			},
			'日志',
			h('span', { class: 'count' }, logCount > 0 ? ` ${logCount}` : ''),
			icon('chevron')
		)
	);
}

export function renderLogs(lines: readonly string[]): HTMLElement {
	return h(
		'div',
		{ class: 'logs', id: 'bh-logs' },
		h(
			'div',
			{ class: 'logs-head' },
			h('span', {}, '运行日志'),
			h('button', { class: 'text-btn', type: 'button', 'data-action': 'copy-logs' }, icon('copy'), '复制')
		),
		h('pre', { class: 'log-lines' }, lines.join('\n'))
	);
}
