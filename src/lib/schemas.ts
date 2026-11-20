import { z } from 'zod';

// ── Download error codes ──
export const ErrorCode = {
	OK: 0,
	FAILED_TO_FETCH: -1,
	INVALID_RESPONSE: -2,
	VIP_ONLY: -10403,
	UNKNOWN: -99999
} as const;

// ── Zod schemas for Bilibili API responses ──

export const VideoPageDataSchema = z.object({
	aid: z.number(),
	bvid: z.string(),
	cid: z.number(),
	title: z.string(),
	pages: z.array(
		z.object({
			page: z.number(),
			part: z.string(),
			cid: z.number()
		})
	)
});

export const VideoDataSchema = z.object({
	aid: z.number(),
	bvid: z.string(),
	cid: z.number(),
	title: z.string(),
	pages: z.array(
		z.object({
			page: z.number(),
			part: z.string(),
			cid: z.number()
		})
	),
	videoData: VideoPageDataSchema
});

export type VideoData = z.infer<typeof VideoDataSchema>;
export type VideoPageData = z.infer<typeof VideoPageDataSchema>;

export const DashStreamSchema = z.object({
	id: z.number(),
	base_url: z.string().optional(),
	baseUrl: z.string().optional(),
	backup_url: z.array(z.string()).optional(),
	backupUrl: z.array(z.string()).optional(),
	codecid: z.number().optional(),
	codecs: z.string().optional(),
	bandwidth: z.number().optional(),
	mimeType: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	size: z.number().optional()
}).refine((v) => v.base_url || v.baseUrl, { message: 'must have base_url or baseUrl' });

export type DashStream = z.infer<typeof DashStreamSchema>;

export const DashDataSchema = z.object({
	audio: z.array(DashStreamSchema),
	video: z.array(DashStreamSchema)
});

export type DashData = z.infer<typeof DashDataSchema>;

export const DurlSegmentSchema = z.object({
	url: z.string(),
	backup_url: z.array(z.string()).optional(),
	size: z.number().optional()
});

export type DurlSegment = z.infer<typeof DurlSegmentSchema>;

export const PlayUrlResponseSchema = z.object({
	code: z.number(),
	message: z.string().optional(),
	data: z
		.object({
			dash: DashDataSchema.optional(),
			durl: z.array(DurlSegmentSchema).optional(),
			accept_quality: z.array(z.number()).optional(),
			accept_description: z.array(z.string()).optional(),
			video_codecid: z.number().optional(),
			support_formats: z
				.array(
					z.object({
						quality: z.number(),
						new_description: z.string().optional(),
						display_desc: z.string().optional()
					})
				)
				.optional()
		})
		.optional()
});

export type PlayUrlResponse = z.infer<typeof PlayUrlResponseSchema>;

export const InitialStateResponseSchema = z.object({
	code: z.number(),
	data: z.any().optional(),
	message: z.string().optional()
});

export type InitialStateResponse = z.infer<typeof InitialStateResponseSchema>;

// ── Download link result ──

export const DownloadResultSchema = z.object({
	code: z.number(),
	dash: z
		.object({
			audio: DashStreamSchema,
			video: DashStreamSchema
		})
		.optional(),
	durl: z.array(DurlSegmentSchema).optional(),
	qualityDescription: z.string().optional()
});

export type DownloadResult = z.infer<typeof DownloadResultSchema>;

// ── Settings ──

export const SettingsSchema = z.object({
	downloadMode: z.enum(['advanced', 'normal']),
	mergeMode: z.enum(['on', 'off']),
	show: z.enum(['show', 'hide'])
});

export type Settings = z.infer<typeof SettingsSchema>;