/**
 * Per-option download state for the popup. Lives outside the DOM so progress
 * survives closing and reopening the popup, and so the toolbar button can show
 * overall progress while the popup is closed.
 */

import { formatSize } from '../utils';
import type { DownloadOption } from '../download';
import type { SegmentDescriptor } from '../downloader/orchestration';

export type TaskState =
	| { status: 'downloading'; received: number; total: number; startedAt: number }
	| { status: 'merging' }
	| { status: 'done'; url: string; size: number }
	| { status: 'error'; message: string };

export interface DownloadDeps {
	downloadStream(segment: SegmentDescriptor, onProgress: (received: number, total: number) => void): Promise<Blob>;
	downloadAndMerge(
		segments: { audio: SegmentDescriptor; video: SegmentDescriptor },
		onProgress: (which: 'audio' | 'video', received: number, total: number) => void,
		onMerging: () => void
	): Promise<{ data: ArrayBuffer; cleanup: () => void }>;
	/** Trigger the browser save and return an object URL that can be clicked again. */
	saveBlob(blob: Blob, filename: string): string;
	revokeUrl(url: string): void;
	now(): number;
	log(line: string): void;
}

export interface TaskSummary {
	active: number;
	/** 0-100 across active downloads with a known size, or null when unknown. */
	percent: number | null;
}

type Listener = (id: string) => void;

function errorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

export class DownloadTasks {
	private readonly states = new Map<string, TaskState>();
	private readonly listeners = new Set<Listener>();

	constructor(private readonly deps: DownloadDeps) {}

	get(id: string): TaskState | undefined {
		return this.states.get(id);
	}

	isActive(id: string): boolean {
		const status = this.states.get(id)?.status;
		return status === 'downloading' || status === 'merging';
	}

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	summary(): TaskSummary {
		let active = 0;
		let received = 0;
		let total = 0;
		for (const state of this.states.values()) {
			if (state.status === 'downloading') {
				active++;
				if (state.total > 0) {
					received += Math.min(state.received, state.total);
					total += state.total;
				}
			} else if (state.status === 'merging') {
				active++;
			}
		}
		return { active, percent: total > 0 ? Math.floor((received / total) * 100) : null };
	}

	/** Start (or restart) a download. A second start while one is running is ignored. */
	async start(option: DownloadOption): Promise<void> {
		if (this.isActive(option.id)) return;
		this.forget(option.id);

		const startedAt = this.deps.now();
		const progress = (received: number, total: number): void => {
			this.set(option.id, { status: 'downloading', received, total, startedAt });
		};
		progress(0, option.size ?? 0);
		this.deps.log(`开始下载 ${option.filename}`);

		try {
			const blob =
				option.kind === 'merged' ? await this.runMerged(option, progress) : await this.runSingle(option, progress);
			const url = this.deps.saveBlob(blob, option.filename);
			this.set(option.id, { status: 'done', url, size: blob.size });
			this.deps.log(`已保存 ${option.filename}（${formatSize(blob.size)}）`);
		} catch (err) {
			const message = errorMessage(err);
			this.set(option.id, { status: 'error', message });
			this.deps.log(`下载失败 ${option.filename}：${message}`);
		}
	}

	/** Drop finished/failed state (revoking its object URL). Running downloads are kept. */
	forget(id: string): void {
		const state = this.states.get(id);
		if (!state || this.isActive(id)) return;
		if (state.status === 'done') this.deps.revokeUrl(state.url);
		this.states.delete(id);
		this.emit(id);
	}

	/** Forget everything not in `ids`, e.g. after a quality or episode change. */
	retain(ids: ReadonlySet<string>): void {
		for (const id of [...this.states.keys()]) {
			if (!ids.has(id)) this.forget(id);
		}
	}

	dispose(): void {
		for (const state of this.states.values()) {
			if (state.status === 'done') this.deps.revokeUrl(state.url);
		}
		this.states.clear();
		this.listeners.clear();
	}

	private async runSingle(option: DownloadOption, progress: (r: number, t: number) => void): Promise<Blob> {
		const fallbackTotal = option.size ?? 0;
		return this.deps.downloadStream(option.segments[0], (received, total) =>
			progress(received, total > 0 ? total : fallbackTotal)
		);
	}

	private async runMerged(option: DownloadOption, progress: (r: number, t: number) => void): Promise<Blob> {
		const [audio, video] = option.segments;
		const parts = {
			audio: { received: 0, total: audio.size ?? 0 },
			video: { received: 0, total: video.size ?? 0 }
		};
		const { data, cleanup } = await this.deps.downloadAndMerge(
			{ audio, video },
			(which, received, total) => {
				parts[which] = { received, total: total > 0 ? total : parts[which].total };
				const known = parts.audio.total > 0 && parts.video.total > 0;
				progress(parts.audio.received + parts.video.received, known ? parts.audio.total + parts.video.total : 0);
			},
			() => {
				this.set(option.id, { status: 'merging' });
				this.deps.log(`正在合并音视频 ${option.filename}`);
			}
		);
		try {
			return new Blob([data], { type: 'video/mp4' });
		} finally {
			cleanup();
		}
	}

	private set(id: string, state: TaskState): void {
		this.states.set(id, state);
		this.emit(id);
	}

	private emit(id: string): void {
		for (const listener of this.listeners) listener(id);
	}
}
