import { afterEach, describe, expect, it, vi } from 'vitest';
import { DownloadTasks, RELEASE_AFTER_SAVE_MS, type DownloadDeps } from './tasks';
import type { DownloadOption } from '../download';

const single: DownloadOption = {
	id: 'video:https://cdn/v.m4s',
	kind: 'video',
	label: '仅画面',
	detail: '无声音',
	format: 'MP4',
	filename: 'clip_视频.mp4',
	segments: [{ url: 'https://cdn/v.m4s', size: 100 }],
	size: 100,
	recommended: false
};

const merged: DownloadOption = {
	...single,
	id: 'merged:https://cdn/v.m4s',
	kind: 'merged',
	filename: 'clip.mp4',
	segments: [
		{ url: 'https://cdn/a.m4s', size: 40 },
		{ url: 'https://cdn/v.m4s', size: 60 }
	],
	size: 100,
	recommended: true
};

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (err: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
}

function makeDeps(overrides: Partial<DownloadDeps> = {}): DownloadDeps {
	return {
		downloadStream: vi.fn(async () => new Blob([new Uint8Array(100)])),
		downloadAndMerge: vi.fn(async () => ({ data: new ArrayBuffer(90), cleanup: vi.fn() })),
		saveBlob: vi.fn(() => 'blob:saved'),
		revokeUrl: vi.fn(),
		now: () => 1000,
		log: vi.fn(),
		...overrides
	};
}

describe('DownloadTasks', () => {
	it('reports progress, saves the file and ends in the done state', async () => {
		const gate = deferred<Blob>();
		let report: (r: number, t: number) => void = () => {};
		const deps = makeDeps({
			downloadStream: vi.fn((_seg, onProgress) => {
				report = onProgress;
				return gate.promise;
			})
		});
		const tasks = new DownloadTasks(deps);
		const run = tasks.start(single);

		expect(tasks.get(single.id)).toEqual({ status: 'downloading', received: 0, total: 100, startedAt: 1000 });
		report(25, -1);
		expect(tasks.get(single.id)).toMatchObject({ received: 25, total: 100 });
		expect(tasks.summary()).toEqual({ active: 1, percent: 25 });

		gate.resolve(new Blob([new Uint8Array(100)]));
		await run;

		expect(deps.saveBlob).toHaveBeenCalledWith(expect.any(Blob), 'clip_视频.mp4');
		expect(tasks.get(single.id)).toEqual({ status: 'done', url: 'blob:saved', size: 100 });
		expect(tasks.summary()).toEqual({ active: 0, percent: null });
	});

	it('ignores a second start while the same option is running', async () => {
		const gate = deferred<Blob>();
		const deps = makeDeps({ downloadStream: vi.fn(() => gate.promise) });
		const tasks = new DownloadTasks(deps);

		const first = tasks.start(single);
		await tasks.start(single);
		gate.resolve(new Blob([]));
		await first;

		expect(deps.downloadStream).toHaveBeenCalledTimes(1);
	});

	it('records errors and allows a retry', async () => {
		const deps = makeDeps({
			downloadStream: vi
				.fn(async () => new Blob([new Uint8Array(100)]))
				.mockRejectedValueOnce(new Error('HTTP 403 Forbidden'))
		});
		const tasks = new DownloadTasks(deps);

		await tasks.start(single);
		expect(tasks.get(single.id)).toEqual({ status: 'error', message: 'HTTP 403 Forbidden' });
		expect(deps.log).toHaveBeenLastCalledWith(expect.stringContaining('HTTP 403 Forbidden'));

		await tasks.start(single);
		expect(tasks.get(single.id)?.status).toBe('done');
	});

	it('revokes the previous object URL when an option is downloaded again', async () => {
		const deps = makeDeps({ saveBlob: vi.fn().mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second') });
		const tasks = new DownloadTasks(deps);

		await tasks.start(single);
		await tasks.start(single);

		expect(deps.revokeUrl).toHaveBeenCalledWith('blob:first');
		expect(tasks.get(single.id)).toMatchObject({ url: 'blob:second' });
	});

	it('combines audio and video progress, then shows merging, then cleans up FFmpeg', async () => {
		const cleanup = vi.fn();
		const gate = deferred<{ data: ArrayBuffer; cleanup: () => void }>();
		let report: (which: 'audio' | 'video', r: number, t: number) => void = () => {};
		let merging: () => void = () => {};
		const deps = makeDeps({
			downloadAndMerge: vi.fn((segments, onProgress, onMerging) => {
				expect(segments.audio.url).toBe('https://cdn/a.m4s');
				expect(segments.video.url).toBe('https://cdn/v.m4s');
				report = onProgress;
				merging = onMerging;
				return gate.promise;
			})
		});
		const tasks = new DownloadTasks(deps);
		const run = tasks.start(merged);

		report('audio', 40, 40);
		report('video', 30, 60);
		expect(tasks.get(merged.id)).toMatchObject({ status: 'downloading', received: 70, total: 100 });

		merging();
		expect(tasks.get(merged.id)).toEqual({ status: 'merging' });
		expect(tasks.summary()).toEqual({ active: 1, percent: null });

		gate.resolve({ data: new ArrayBuffer(90), cleanup });
		await run;

		expect(cleanup).toHaveBeenCalledOnce();
		expect(tasks.get(merged.id)).toEqual({ status: 'done', url: 'blob:saved', size: 90 });
	});

	it('reports unknown totals when a stream size is unknown', async () => {
		let report: (which: 'audio' | 'video', r: number, t: number) => void = () => {};
		const gate = deferred<{ data: ArrayBuffer; cleanup: () => void }>();
		const deps = makeDeps({
			downloadAndMerge: vi.fn((_s, onProgress) => {
				report = onProgress;
				return gate.promise;
			})
		});
		const tasks = new DownloadTasks(deps);
		const option = {
			...merged,
			segments: [{ url: 'https://cdn/a.m4s' }, { url: 'https://cdn/v.m4s' }],
			size: undefined
		};
		const run = tasks.start(option);

		report('audio', 10, -1);
		expect(tasks.get(option.id)).toMatchObject({ received: 10, total: 0 });
		expect(tasks.summary().percent).toBeNull();

		gate.resolve({ data: new ArrayBuffer(1), cleanup: () => {} });
		await run;
	});

	it('retain() forgets finished options that are no longer offered but keeps running ones', async () => {
		const gate = deferred<Blob>();
		const deps = makeDeps({
			downloadStream: vi.fn().mockResolvedValueOnce(new Blob([])).mockReturnValueOnce(gate.promise)
		});
		const tasks = new DownloadTasks(deps);
		const other = { ...single, id: 'audio:https://cdn/a.m4s' };

		await tasks.start(single);
		const running = tasks.start(other);
		tasks.retain(new Set());

		expect(tasks.get(single.id)).toBeUndefined();
		expect(deps.revokeUrl).toHaveBeenCalledWith('blob:saved');
		expect(tasks.isActive(other.id)).toBe(true);

		gate.resolve(new Blob([]));
		await running;
	});

	it('notifies subscribers and stops after unsubscribe', async () => {
		const tasks = new DownloadTasks(makeDeps());
		const listener = vi.fn();
		const unsubscribe = tasks.subscribe(listener);

		await tasks.start(single);
		expect(listener).toHaveBeenCalledWith(single.id);

		listener.mockClear();
		unsubscribe();
		await tasks.start(single);
		expect(listener).not.toHaveBeenCalled();
	});

	it('keeps the error when the other merged stream reports progress after a failure', async () => {
		let report: (which: 'audio' | 'video', r: number, t: number) => void = () => {};
		let merging: () => void = () => {};
		const deps = makeDeps({
			downloadAndMerge: vi
				.fn<DownloadDeps['downloadAndMerge']>(async () => ({ data: new ArrayBuffer(90), cleanup: vi.fn() }))
				.mockImplementationOnce(async (_s, onProgress, onMerging) => {
					report = onProgress;
					merging = onMerging;
					throw new Error('audio download failed: HTTP 403');
				})
		});
		const tasks = new DownloadTasks(deps);

		await tasks.start(merged);
		report('video', 50, 60);
		merging();

		expect(tasks.get(merged.id)).toEqual({ status: 'error', message: 'audio download failed: HTTP 403' });
		expect(tasks.isActive(merged.id)).toBe(false);
		expect(tasks.summary().active).toBe(0);

		await tasks.start(merged);
		expect(deps.downloadAndMerge).toHaveBeenCalledTimes(2);
		expect(tasks.get(merged.id)?.status).toBe('done');
	});

	it('ignores progress from an earlier attempt once a retry is running', async () => {
		const reports: Array<(r: number, t: number) => void> = [];
		const first = deferred<Blob>();
		const second = deferred<Blob>();
		const gates = [first, second];
		const deps = makeDeps({
			downloadStream: vi.fn((_seg, onProgress) => {
				reports.push(onProgress);
				return gates[reports.length - 1].promise;
			})
		});
		const tasks = new DownloadTasks(deps);

		const attempt1 = tasks.start(single);
		first.reject(new Error('first attempt failed'));
		await attempt1;
		const attempt2 = tasks.start(single);

		reports[0](99, 100);
		expect(tasks.get(single.id)).toMatchObject({ status: 'downloading', received: 0 });
		reports[1](10, 100);
		expect(tasks.get(single.id)).toMatchObject({ status: 'downloading', received: 10 });

		second.resolve(new Blob([]));
		await attempt2;
		expect(tasks.get(single.id)?.status).toBe('done');
	});

	describe('downloads that finish after their option is no longer offered', () => {
		afterEach(() => vi.useRealTimers());

		it('still saves the file, drops its state and releases the URL after a delay', async () => {
			vi.useFakeTimers();
			const gate = deferred<Blob>();
			const deps = makeDeps({ downloadStream: vi.fn(() => gate.promise) });
			const tasks = new DownloadTasks(deps);
			tasks.retain(new Set([single.id]));
			const run = tasks.start(single);

			tasks.retain(new Set(['video:https://cdn/other-quality.m4s']));
			expect(tasks.isActive(single.id)).toBe(true);
			gate.resolve(new Blob([new Uint8Array(100)]));
			await run;

			expect(deps.saveBlob).toHaveBeenCalledOnce();
			expect(tasks.get(single.id)).toBeUndefined();
			expect(deps.revokeUrl).not.toHaveBeenCalled();

			vi.advanceTimersByTime(RELEASE_AFTER_SAVE_MS);
			expect(deps.revokeUrl).toHaveBeenCalledWith('blob:saved');
		});

		it('drops failed state too', async () => {
			const gate = deferred<Blob>();
			const tasks = new DownloadTasks(makeDeps({ downloadStream: vi.fn(() => gate.promise) }));
			tasks.retain(new Set([single.id]));
			const run = tasks.start(single);
			tasks.retain(new Set());
			gate.reject(new Error('HTTP 403'));
			await run;
			expect(tasks.get(single.id)).toBeUndefined();
		});

		it('keeps the result when the option is offered again before it finishes', async () => {
			const gate = deferred<Blob>();
			const tasks = new DownloadTasks(makeDeps({ downloadStream: vi.fn(() => gate.promise) }));
			const run = tasks.start(single);
			tasks.retain(new Set());
			tasks.retain(new Set([single.id]));
			gate.resolve(new Blob([]));
			await run;
			expect(tasks.get(single.id)).toMatchObject({ status: 'done', url: 'blob:saved' });
		});

		it('dispose() revokes URLs still waiting for release', async () => {
			vi.useFakeTimers();
			const gate = deferred<Blob>();
			const deps = makeDeps({ downloadStream: vi.fn(() => gate.promise) });
			const tasks = new DownloadTasks(deps);
			const run = tasks.start(single);
			tasks.retain(new Set());
			gate.resolve(new Blob([]));
			await run;

			tasks.dispose();
			expect(deps.revokeUrl).toHaveBeenCalledOnce();
			vi.advanceTimersByTime(RELEASE_AFTER_SAVE_MS);
			expect(deps.revokeUrl).toHaveBeenCalledOnce();
		});
	});

	it('dispose() revokes every saved URL', async () => {
		const deps = makeDeps();
		const tasks = new DownloadTasks(deps);
		await tasks.start(single);
		tasks.dispose();
		expect(deps.revokeUrl).toHaveBeenCalledWith('blob:saved');
		expect(tasks.get(single.id)).toBeUndefined();
	});
});
