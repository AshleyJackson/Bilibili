// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mergeAudioVideo } from './ffmpeg';

const ffmpegMock = vi.hoisted(() => ({
	on: vi.fn(),
	load: vi.fn(),
	writeFile: vi.fn(),
	exec: vi.fn(),
	readFile: vi.fn(),
	deleteFile: vi.fn(),
	terminate: vi.fn()
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

beforeEach(() => {
	vi.clearAllMocks();
	ffmpegMock.load.mockResolvedValue(true);
	ffmpegMock.writeFile.mockResolvedValue(undefined);
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
	});

	it('surfaces failed Blob reads with a stable error and no input details', async () => {
		const audio = new Blob([new Uint8Array([1, 2])]);
		vi.spyOn(audio, 'arrayBuffer').mockRejectedValue(new Error('private input details'));

		await expect(mergeAudioVideo('chrome-extension://extension-id', audio, new Blob())).rejects.toThrow(
			'Unable to read file data. Please try the download again.'
		);
		expect(ffmpegMock.writeFile).not.toHaveBeenCalled();
	});
});
