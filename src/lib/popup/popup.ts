/**
 * Download popup controller. Owns the shadow-DOM panel anchored to the toolbar
 * button: renders the current download options, patches single rows as task
 * progress arrives, keeps a bounded log buffer, and handles dismissal.
 */

import { autoUpdate, computePosition, flip, offset, shift, size, type Placement } from '@floating-ui/dom';
import { buildDownloadOptions, type DisplayInfo, type DownloadOption } from '../download';
import type { DownloadTasks } from './tasks';
import { POPUP_STYLES } from './styles';
import { icon, renderBody, renderFooter, renderHeader, renderLogs, renderRow } from './view';

export const POPUP_HOST_ID = 'bilibili-helper-popup';
const MAX_LOG_LINES = 300;
const VIEWPORT_PADDING = 8;
const COPIED_FEEDBACK_MS = 1500;

const schedule: (cb: () => void) => void =
	typeof requestAnimationFrame === 'function' ? (cb) => requestAnimationFrame(cb) : (cb) => setTimeout(cb, 16);

export class DownloadPopup {
	private info: DisplayInfo | null = null;
	private options: DownloadOption[] = [];
	private readonly logs: string[] = [];
	private logsOpen = false;

	private host: HTMLElement | null = null;
	private panel: HTMLElement | null = null;
	private anchor: HTMLElement | null = null;
	private placement: Placement = 'bottom-start';
	private stopAutoUpdate: (() => void) | null = null;
	private readonly rowEls = new Map<string, HTMLElement>();
	private readonly dirtyRows = new Set<string>();
	private frameQueued = false;
	private readonly unsubscribe: () => void;

	constructor(
		private readonly tasks: DownloadTasks,
		private readonly now: () => number = () => Date.now(),
		private readonly onToggle: (open: boolean) => void = () => {}
	) {
		this.unsubscribe = tasks.subscribe((id) => this.queueRow(id));
	}

	isOpen(): boolean {
		return this.host !== null;
	}

	setInfo(info: DisplayInfo | null): void {
		this.info = info;
		this.options = info ? buildDownloadOptions(info) : [];
		this.tasks.retain(new Set(this.options.map((o) => o.id)));
		this.render();
	}

	toggle(anchor: HTMLElement, placement: Placement): void {
		if (this.isOpen()) this.close();
		else this.open(anchor, placement);
	}

	open(anchor: HTMLElement, placement: Placement): void {
		if (this.isOpen()) this.close();
		this.anchor = anchor;
		this.placement = placement;

		const host = document.createElement('div');
		host.id = POPUP_HOST_ID;
		// Hidden until the first computePosition so it never flashes at 0,0.
		host.style.visibility = 'hidden';
		const root = host.attachShadow({ mode: 'open' });
		const style = document.createElement('style');
		style.textContent = POPUP_STYLES;
		this.panel = document.createElement('div');
		this.panel.className = 'panel';
		this.panel.setAttribute('role', 'dialog');
		this.panel.setAttribute('aria-labelledby', 'bh-title');
		root.append(style, this.panel);
		root.addEventListener('click', this.onClick);
		document.body.appendChild(host);
		this.host = host;

		document.addEventListener('pointerdown', this.onPointerDown, true);
		document.addEventListener('keydown', this.onKeyDown, true);
		this.stopAutoUpdate = autoUpdate(anchor, host, () => this.position());
		this.render();
		this.onToggle(true);
		this.panel.querySelector<HTMLElement>('[data-action="download"]')?.focus({ preventScroll: true });
	}

	close(): void {
		if (!this.host) return;
		this.stopAutoUpdate?.();
		this.stopAutoUpdate = null;
		document.removeEventListener('pointerdown', this.onPointerDown, true);
		document.removeEventListener('keydown', this.onKeyDown, true);
		this.host.remove();
		this.host = null;
		this.panel = null;
		this.rowEls.clear();
		this.onToggle(false);
	}

	appendLog(line: string): void {
		this.logs.push(line);
		if (this.logs.length > MAX_LOG_LINES) this.logs.splice(0, this.logs.length - MAX_LOG_LINES);
		this.renderLogState();
	}

	clearLogs(): void {
		this.logs.length = 0;
		this.renderLogState();
	}

	destroy(): void {
		this.close();
		this.unsubscribe();
	}

	private optionById(id: string | undefined): DownloadOption | undefined {
		return id === undefined ? undefined : this.options.find((o) => o.id === id);
	}

	private render(): void {
		if (!this.panel) return;
		this.rowEls.clear();
		const rows = this.options.map((option, index) => {
			const row = renderRow(option, this.tasks.get(option.id), this.now(), index);
			this.rowEls.set(option.id, row);
			return row;
		});
		this.panel.replaceChildren(
			renderHeader(this.info),
			renderBody(this.info, rows),
			renderFooter(this.logs.length, this.logsOpen),
			this.logsOpen ? renderLogs(this.logs) : ''
		);
	}

	private renderLogState(): void {
		if (!this.panel) return;
		const count = this.panel.querySelector('.foot .count');
		if (count) count.textContent = this.logs.length > 0 ? ` ${this.logs.length}` : '';
		const lines = this.panel.querySelector<HTMLElement>('.log-lines');
		if (!lines) return;
		const pinned = lines.scrollHeight - lines.scrollTop - lines.clientHeight < 24;
		lines.textContent = this.logs.join('\n');
		if (pinned) lines.scrollTop = lines.scrollHeight;
	}

	private queueRow(id: string): void {
		if (!this.panel || !this.rowEls.has(id)) return;
		this.dirtyRows.add(id);
		if (this.frameQueued) return;
		this.frameQueued = true;
		schedule(() => {
			this.frameQueued = false;
			for (const dirty of this.dirtyRows) this.patchRow(dirty);
			this.dirtyRows.clear();
		});
	}

	private patchRow(id: string): void {
		const current = this.rowEls.get(id);
		const index = this.options.findIndex((o) => o.id === id);
		if (!current || index < 0) return;
		const focusedAction =
			(this.host?.shadowRoot?.activeElement as HTMLElement | null)?.closest('[data-row]') === current;
		const next = renderRow(this.options[index], this.tasks.get(id), this.now(), index);
		current.replaceWith(next);
		this.rowEls.set(id, next);
		if (focusedAction) next.querySelector<HTMLElement>('button, a')?.focus({ preventScroll: true });
	}

	private position(): void {
		const host = this.host;
		const anchor = this.anchor;
		if (!host || !anchor) return;
		computePosition(anchor, host, {
			strategy: 'fixed',
			placement: this.placement,
			middleware: [
				offset(8),
				flip({ padding: VIEWPORT_PADDING }),
				shift({ padding: VIEWPORT_PADDING }),
				size({
					padding: VIEWPORT_PADDING,
					apply: ({ availableHeight }) => {
						if (this.panel) this.panel.style.maxHeight = `${Math.max(220, availableHeight)}px`;
					}
				})
			]
		}).then(({ x, y }) => {
			host.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
			host.style.visibility = '';
		});
	}

	private readonly onClick = (event: Event): void => {
		const target = (event.target as Element | null)?.closest<HTMLElement>('[data-action]');
		if (!target) return;
		const action = target.dataset.action;
		const option = this.optionById(target.dataset.id);
		switch (action) {
			case 'close':
				this.close();
				this.anchor?.focus({ preventScroll: true });
				break;
			case 'download':
				if (option) void this.tasks.start(option);
				break;
			case 'copy':
				if (option) this.copy(option.segments[0].url, target, '已复制直链');
				break;
			case 'copy-logs':
				this.copy(this.logs.join('\n'), target, '已复制日志');
				break;
			case 'toggle-logs':
				this.logsOpen = !this.logsOpen;
				this.render();
				this.panel?.querySelector<HTMLElement>('[data-action="toggle-logs"]')?.focus({ preventScroll: true });
				if (this.logsOpen) this.renderLogState();
				break;
		}
	};

	private copy(text: string, button: HTMLElement, done: string): void {
		const clipboard = navigator.clipboard;
		if (!clipboard) {
			this.appendLog('复制失败：当前页面无法访问剪贴板');
			return;
		}
		clipboard.writeText(text).then(
			() => {
				const original = [...button.childNodes];
				const title = button.title;
				button.classList.add('copied');
				button.title = done;
				button.replaceChildren(icon('check'));
				setTimeout(() => {
					button.classList.remove('copied');
					button.title = title;
					button.replaceChildren(...original);
				}, COPIED_FEEDBACK_MS);
			},
			(err: unknown) => this.appendLog(`复制失败：${err instanceof Error ? err.message : String(err)}`)
		);
	}

	private readonly onPointerDown = (event: Event): void => {
		const path = event.composedPath();
		if (this.host && path.includes(this.host)) return;
		// The anchor's own click toggles the popup; closing here would reopen it.
		if (this.anchor && path.includes(this.anchor)) return;
		this.close();
	};

	private readonly onKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== 'Escape') return;
		event.stopPropagation();
		this.close();
		this.anchor?.focus({ preventScroll: true });
	};
}
