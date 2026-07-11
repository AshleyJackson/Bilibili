/**
 * Structured logger for the Bilibili download helper extension.
 *
 * Provides module-prefixed logging at three severity levels (info, warn, error)
 * and writes to both the browser console and the in-page UI log panel.
 *
 * Use instead of raw console.log / the host.ts `log()` function directly,
 * so every log message carries a module tag and timestamp for debugging.
 */

type LogLevel = 'info' | 'warn' | 'error';

const LEVEL_PREFIX: Record<LogLevel, string> = {
	info: '',
	warn: '[WARN]',
	error: '[ERROR]'
};

/**
 * Format a UTC timestamp for log messages.
 * Returns "HH:MM:SS.mmm" so multiple messages in the same second are distinguishable.
 */
function timestamp(): string {
	const d = new Date();
	return (
		String(d.getHours()).padStart(2, '0') +
		':' +
		String(d.getMinutes()).padStart(2, '0') +
		':' +
		String(d.getSeconds()).padStart(2, '0') +
		'.' +
		String(d.getMilliseconds()).padStart(3, '0')
	);
}

/** Map a severity level to the appropriate console method. */
const consoleMethod: Record<LogLevel, (typeof console)['log']> = {
	info: console.log,
	warn: console.warn,
	error: console.error
};

/**
 * Core log function.
 *
 * @param module  Short module identifier, e.g. "api", "download", "ffmpeg", "wbi", "fetch", "host", "main".
 * @param level   Severity level.
 * @param args    One or more values to log.
 */
function log(module: string, level: LogLevel, ...args: unknown[]): void {
	const ts = timestamp();
	const levelTag = LEVEL_PREFIX[level] ? ' ' + LEVEL_PREFIX[level] : '';
	const prefix = `[${ts}][${module}]${levelTag}`;
	const ns = '[bilibili downloader]';

	// Console output — namespace first so DevTools filtering works
	consoleMethod[level](ns, prefix, ...args);

	// In-page UI panel (silently skip if not available)
	try {
		const el = document.getElementById('bilibili-helper-host');
		if (!el?.shadowRoot) return;
		const logs = el.shadowRoot.querySelector<HTMLElement>('#bilibliHelperLogs');
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
		logs.innerHTML += `<p>${prefix} ${line}</p>`;
	} catch {
		// UI may not exist yet — ignore silently.
	}
}

// ── Public API ──

export function logInfo(module: string, ...args: unknown[]): void {
	log(module, 'info', ...args);
}

export function logWarn(module: string, ...args: unknown[]): void {
	log(module, 'warn', ...args);
}

export function logError(module: string, ...args: unknown[]): void {
	log(module, 'error', ...args);
}

/**
 * Convenience: log an operation with its duration.
 *
 * Returns a stop function. Call it when the operation completes to emit
 * a "done in Xms" message.
 *
 * @example
 *   const done = logDuration('api', 'fetchUgcPlayUrl', { avid, cid });
 *   const result = await fetchUgcPlayUrl(...);
 *   done();
 */
export function logDuration(
	module: string,
	label: string,
	context?: Record<string, unknown>
): () => void {
	const start = performance.now();
	const ctx = context ? ' ' + JSON.stringify(context) : '';
	logInfo(module, `${label}...${ctx}`);
	return (): void => {
		const ms = Math.round(performance.now() - start);
		logInfo(module, `${label} done in ${ms}ms`);
	};
}

/**
 * Convenience: log a fetch attempt including URL method, status code, and duration.
 *
 * Call immediately before fetch, then invoke the returned function with the response
 * (or null on error).
 */
export function logFetch(
	module: string,
	url: string,
	method: string
): (responseOrNull: Response | null) => void {
	const start = performance.now();
	const short = url.length > 120 ? url.slice(0, 120) + '...' : url;
	logInfo(module, `${method} ${short}`);
	return (res: Response | null): void => {
		const ms = Math.round(performance.now() - start);
		if (res) {
			logInfo(module, `${method} ${res.status} in ${ms}ms (${short})`);
		} else {
			logError(module, `${method} failed after ${ms}ms (${short})`);
		}
	};
}
