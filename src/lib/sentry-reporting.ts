export const SENTRY_ERROR_MESSAGE_TYPE = 'bilibili-helper:sentry-error';
export const CONTENT_SCRIPT_ERROR_EVENT = 'bilibili-helper:sentry-page-error';

export type SentryErrorSource = 'content-script' | 'extension-popup';

export const SENTRY_REPORT_RATE_LIMITS: Readonly<Record<SentryErrorSource, number>> = {
	'content-script': 5,
	'extension-popup': 20
};
export const SENTRY_REPORT_RATE_WINDOW_MS = 60_000;

export interface SerializedSentryError {
	name: string;
	message: string;
	stack?: string;
}

export interface SentryErrorMessage {
	type: typeof SENTRY_ERROR_MESSAGE_TYPE;
	source: SentryErrorSource;
	module?: string;
	error: SerializedSentryError;
}

interface ReportRateWindow {
	startedAt: number | null;
	count: number;
}

export function createSentryReportRateLimiter(
	limits: Readonly<Record<SentryErrorSource, number>> = SENTRY_REPORT_RATE_LIMITS,
	windowMs = SENTRY_REPORT_RATE_WINDOW_MS
): (source: SentryErrorSource, now?: number) => boolean {
	const windows: Record<SentryErrorSource, ReportRateWindow> = {
		'content-script': { startedAt: null, count: 0 },
		'extension-popup': { startedAt: null, count: 0 }
	};

	return (source, now = Date.now()) => {
		const window = windows[source];
		if (window.startedAt === null || now - window.startedAt >= windowMs || now < window.startedAt) {
			window.startedAt = now;
			window.count = 0;
		}
		if (window.count >= limits[source]) return false;

		window.count += 1;
		return true;
	};
}

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_STACK_LENGTH = 12_000;
const MODULE_PATTERN = /^[a-zA-Z0-9_.-]{1,80}$/;

export function serializeSentryError(error: unknown): SerializedSentryError {
	let name = 'Error';
	let message: string;
	let stack: string | undefined;

	if (error instanceof Error) {
		name = error.name || name;
		message = error.message || name;
		stack = error.stack;
	} else if (typeof error === 'string') {
		message = error;
	} else {
		try {
			message = String(error);
		} catch {
			message = 'Unknown error';
		}
	}

	return {
		name: name.slice(0, MAX_NAME_LENGTH),
		message: message.slice(0, MAX_MESSAGE_LENGTH),
		...(typeof stack === 'string' ? { stack: stack.slice(0, MAX_STACK_LENGTH) } : {})
	};
}

export function createSentryErrorMessage(
	error: unknown,
	source: SentryErrorSource,
	module?: string
): SentryErrorMessage {
	return {
		type: SENTRY_ERROR_MESSAGE_TYPE,
		source,
		...(module && MODULE_PATTERN.test(module) ? { module } : {}),
		error: serializeSentryError(error)
	};
}

export function isSentryErrorMessage(value: unknown): value is SentryErrorMessage {
	if (!value || typeof value !== 'object') return false;

	const message = value as Record<string, unknown>;
	if (
		message.type !== SENTRY_ERROR_MESSAGE_TYPE ||
		(message.source !== 'content-script' && message.source !== 'extension-popup')
	) {
		return false;
	}

	if (message.module !== undefined && (typeof message.module !== 'string' || !MODULE_PATTERN.test(message.module))) {
		return false;
	}

	const error = message.error;
	if (!error || typeof error !== 'object') return false;

	const serialized = error as Record<string, unknown>;
	return (
		typeof serialized.name === 'string' &&
		serialized.name.length <= MAX_NAME_LENGTH &&
		typeof serialized.message === 'string' &&
		serialized.message.length <= MAX_MESSAGE_LENGTH &&
		(serialized.stack === undefined ||
			(typeof serialized.stack === 'string' && serialized.stack.length <= MAX_STACK_LENGTH))
	);
}

function redactExternalUrls(value: string): string {
	return value.replace(/https?:\/\/[^\s"'<>]+/gi, '[external URL]');
}

export function sanitizeSentryEvent<T>(event: T): T {
	if (!event || typeof event !== 'object') return event;

	const record = event as Record<string, unknown>;
	delete record.request;
	delete record.user;
	delete record.extra;
	record.breadcrumbs = [];

	if (typeof record.message === 'string') {
		record.message = redactExternalUrls(record.message);
	}
	if (typeof record.transaction === 'string') {
		record.transaction = redactExternalUrls(record.transaction);
	}

	const exception = record.exception;
	if (!exception || typeof exception !== 'object') return event;

	const values = (exception as Record<string, unknown>).values;
	if (!Array.isArray(values)) return event;

	for (const value of values) {
		if (!value || typeof value !== 'object') continue;
		const exceptionValue = value as Record<string, unknown>;
		if (typeof exceptionValue.value === 'string') {
			exceptionValue.value = redactExternalUrls(exceptionValue.value);
		}

		const stacktrace = exceptionValue.stacktrace;
		if (!stacktrace || typeof stacktrace !== 'object') continue;
		const frames = (stacktrace as Record<string, unknown>).frames;
		if (!Array.isArray(frames)) continue;

		for (const frame of frames) {
			if (!frame || typeof frame !== 'object') continue;
			const frameRecord = frame as Record<string, unknown>;
			if (typeof frameRecord.filename === 'string' && /^https?:\/\//i.test(frameRecord.filename)) {
				frameRecord.filename = '[third-party script]';
				delete frameRecord.abs_path;
			}
			delete frameRecord.vars;
		}
	}

	return event;
}

function sendSentryErrorMessage(message: SentryErrorMessage): Promise<boolean> {
	if (typeof chrome === 'undefined' || !chrome.runtime?.id) return Promise.resolve(false);

	try {
		return chrome.runtime
			.sendMessage(message)
			.then((response) => response?.sent === true)
			.catch(() => false);
	} catch {
		// Error reporting must not affect extension behavior.
		return Promise.resolve(false);
	}
}

export function reportErrorToSentry(error: unknown, source: SentryErrorSource, module?: string): Promise<boolean> {
	return sendSentryErrorMessage(createSentryErrorMessage(error, source, module));
}

export function forwardContentScriptErrorMessage(value: unknown): Promise<boolean> {
	if (isSentryErrorMessage(value) && value.source === 'content-script') {
		return sendSentryErrorMessage(value);
	}
	return Promise.resolve(false);
}

const UBLOCK_PREVENT_FETCH_FRAME =
	/chrome-extension:\/\/[^/\s]+\/rulesets\/scripting\/scriptlet\/ublock-filters\.prevent-fetch\.js/i;
const UNSUPPORTED_BILIBILI_STREAM_URL_ERROR = 'Unsupported Bilibili stream URL';

export function dispatchContentScriptError(error: unknown, module?: string): void {
	if (typeof window === 'undefined') return;
	if (error instanceof Error && UBLOCK_PREVENT_FETCH_FRAME.test(error.stack ?? '')) return;
	if (
		(error instanceof Error && error.message === UNSUPPORTED_BILIBILI_STREAM_URL_ERROR) ||
		error === UNSUPPORTED_BILIBILI_STREAM_URL_ERROR
	) {
		return;
	}

	const message = createSentryErrorMessage(error, 'content-script', module);
	window.dispatchEvent(new CustomEvent(CONTENT_SCRIPT_ERROR_EVENT, { detail: message }));
}
