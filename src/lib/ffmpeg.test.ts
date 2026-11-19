// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mergeAudioVideo } from './ffmpeg';

const sentryMock = vi.hoisted(() => ({
	recordSentryBreadcrumb: vi.fn()
}));

const ffmpegMock = vi.hoisted(() => ({
	on: vi.fn(),
	load: vi.fn(async () => {
		ffmpegMock.loaded = true;
		return true;
	}),
	writeFile: vi.fn(),
	exec: vi.fn(),
	readFile: vi.fn(),
	deleteFile: vi.fn(),
	terminate: vi.fn(() => {
		ffmpegMock.loaded = false;
	}),
	loaded: false
}));

vi.mock('@ffmpeg/ffmpeg', () => ({
	FFmpeg: vi.fn(function FFmpegMock() {
		return ffmpegMock;
	})
}));

vi.mock('./fetch-utils', async (importOriginal) => {
	const actual = await importOriginal<typeof import('./fetch-utils')>();
	return {
		...actual,
		fetchAsBlob: vi.fn(async (_url: string, mimeType: string) => `blob:${mimeType}`)
	};
});

vi.mock('./logger', () => ({
	logInfo: vi.fn(),
	logError: vi.fn()
}));

vi.mock('./sentry-reporting', () => sentryMock);

beforeEach(() => {
	vi.clearAllMocks();
	ffmpegMock.load.mockImplementation(async () => {
		ffmpegMock.loaded = true;
		return true;
	});
	ffmpegMock.writeFile.mockImplementation(async () => {
		if (!ffmpegMock.loaded) throw new Error('ffmpeg is not loaded, call `await ffmpeg.load()` first');
	});
	ffmpegMock.exec.mockResolvedValue(undefined);
	ffmpegMock.readFile.mockResolvedValue(new Uint8Array([7, 8]));
	ffmpegMock.deleteFile.mockResolvedValue(undefined);
});

describe('mergeAudioVideo', () => {
	it('reads audio and video Blobs and writes their bytes to FFmpeg', async () => {
		const audio = new Blob([new Uint8Array([1, 2])]);
		const video = new Blob([new Uint8Array([3, 4])]);

		const [data] = await mergeAudioVideo('chrome-extension://extension-id', audio, video);

		const writes = ffmpegMock.writeFile.mock.calls as unknown as [string, Uint8Array][];
		expect(Array.from(writes[0][1])).toEqual([1, 2]);
		expect(Array.from(writes[1][1])).toEqual([3, 4]);
		expect(ffmpegMock.exec).toHaveBeenCalledOnce();
		expect(data.byteLength).toBe(2);
		expect(sentryMock.recordSentryBreadcrumb.mock.calls.map(([message]) => message)).toEqual([
			'FFmpeg merge started',
			'FFmpeg ready',
			'Reading audio data',
			'Audio data read',
			'Reading video data',
			'Video data read',
			'FFmpeg inputs written',
			'FFmpeg command started',
			'FFmpeg command completed',
			'Reading merged output',
			'Merged output read'
		]);
	});

	it('reloads FFmpeg after its cached worker has been terminated', async () => {
		const audio = new Blob([new Uint8Array([1])]);
		const video = new Blob([new Uint8Array([2])]);

		await mergeAudioVideo('chrome-extension://extension-id', audio, video);
		const loadCountBeforeTermination = ffmpegMock.load.mock.calls.length;
		ffmpegMock.terminate();
		await mergeAudioVideo('chrome-extension://extension-id', audio, video);

		expect(ffmpegMock.terminate).toHaveBeenCalledOnce();
		expect(ffmpegMock.load).toHaveBeenCalledTimes(loadCountBeforeTermination + 1);
		expect(ffmpegMock.writeFile).toHaveBeenCalledTimes(4);
	});

	it('shares a single FFmpeg load across concurrent merges', async () => {
		ffmpegMock.loaded = false;
		let finishLoad!: () => void;
		const loadGate = new Promise<void>((resolve) => {
			finishLoad = resolve;
		});
		ffmpegMock.load.mockImplementationOnce(async () => {
			await loadGate;
			ffmpegMock.loaded = true;
			return true;
		});
		const audio = new Blob([new Uint8Array([1])]);
		const video = new Blob([new Uint8Array([2])]);
		const firstMerge = mergeAudioVideo('chrome-extension://extension-id', audio, video);
		const secondMerge = mergeAudioVideo('chrome-extension://extension-id', audio, video);

		await vi.waitFor(() => expect(ffmpegMock.load).toHaveBeenCalledOnce());
		finishLoad();
		await Promise.all([firstMerge, secondMerge]);

		expect(ffmpegMock.load).toHaveBeenCalledOnce();
	});

	it('surfaces failed Blob reads with a stable error and no input details', async () => {
		const audio = new Blob([new Uint8Array([1, 2])]);
		vi.spyOn(audio, 'arrayBuffer').mockRejectedValue(new Error('private input details'));

		await expect(mergeAudioVideo('chrome-extension://extension-id', audio, new Blob())).rejects.toThrow(
			'Unable to read file data. Please try the download again.'
		);
		expect(ffmpegMock.writeFile).not.toHaveBeenCalled();
		expect(sentryMock.recordSentryBreadcrumb.mock.calls.map(([message]) => message)).toEqual([
			'FFmpeg merge started',
			'FFmpeg ready',
			'Reading audio data'
		]);
	});
});
