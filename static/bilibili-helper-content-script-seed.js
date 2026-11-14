//#region src/lib/constants.ts
var HOST_ELEMENT_ID = "bilibili-helper-host";
var CONTENT_SCRIPT_ELEMENT_ID = "bilibili-helper-ext-content-script";
//#endregion
//#region src/lib/sentry-reporting.ts
var SENTRY_ERROR_MESSAGE_TYPE = "bilibili-helper:sentry-error";
var CONTENT_SCRIPT_ERROR_EVENT = "bilibili-helper:sentry-page-error";
var MAX_NAME_LENGTH = 100;
var MAX_MESSAGE_LENGTH = 2e3;
var MAX_STACK_LENGTH = 12e3;
var MODULE_PATTERN = /^[a-zA-Z0-9_.-]{1,80}$/;
function serializeSentryError(error) {
	let name = "Error";
	let message;
	let stack;
	if (error instanceof Error) {
		name = error.name || name;
		message = error.message || name;
		stack = error.stack;
	} else if (typeof error === "string") message = error;
	else try {
		message = String(error);
	} catch {
		message = "Unknown error";
	}
	return {
		name: name.slice(0, MAX_NAME_LENGTH),
		message: message.slice(0, MAX_MESSAGE_LENGTH),
		...typeof stack === "string" ? { stack: stack.slice(0, MAX_STACK_LENGTH) } : {}
	};
}
function createSentryErrorMessage(error, source, module) {
	return {
		type: SENTRY_ERROR_MESSAGE_TYPE,
		source,
		...module && MODULE_PATTERN.test(module) ? { module } : {},
		error: serializeSentryError(error)
	};
}
function isSentryErrorMessage(value) {
	if (!value || typeof value !== "object") return false;
	const message = value;
	if (message.type !== "bilibili-helper:sentry-error" || message.source !== "content-script" && message.source !== "extension-popup") return false;
	if (message.module !== void 0 && (typeof message.module !== "string" || !MODULE_PATTERN.test(message.module))) return false;
	const error = message.error;
	if (!error || typeof error !== "object") return false;
	const serialized = error;
	return typeof serialized.name === "string" && serialized.name.length <= MAX_NAME_LENGTH && typeof serialized.message === "string" && serialized.message.length <= MAX_MESSAGE_LENGTH && (serialized.stack === void 0 || typeof serialized.stack === "string" && serialized.stack.length <= MAX_STACK_LENGTH);
}
function sendSentryErrorMessage(message) {
	if (typeof chrome === "undefined" || !chrome.runtime?.id) return Promise.resolve(false);
	try {
		return chrome.runtime.sendMessage(message).then((response) => response?.sent === true).catch(() => false);
	} catch {
		return Promise.resolve(false);
	}
}
function reportErrorToSentry(error, source, module) {
	return sendSentryErrorMessage(createSentryErrorMessage(error, source, module));
}
function forwardSentryErrorMessage(value) {
	if (isSentryErrorMessage(value)) return sendSentryErrorMessage(value);
	return Promise.resolve(false);
}
//#endregion
//#region src/content-script/seed.ts
(function(win) {
	const ns = "[bilibili downloader]";
	win.addEventListener(CONTENT_SCRIPT_ERROR_EVENT, (event) => {
		const message = event.detail;
		if (!isSentryErrorMessage(message) || message.source !== "content-script" || !message.error.stack?.includes("bilibili-helper-content-script")) return;
		forwardSentryErrorMessage(message);
	});
	win.addEventListener("error", (event) => {
		if (!event.filename.includes("bilibili-helper-content-script-seed")) return;
		reportErrorToSentry(event.error ?? event.message, "content-script", "seed");
	});
	win.addEventListener("unhandledrejection", (event) => {
		if (!(event.reason instanceof Error ? event.reason.stack ?? "" : "").includes("bilibili-helper-content-script-seed")) return;
		reportErrorToSentry(event.reason, "content-script", "seed");
	});
	console.log(ns, "[seed] seed script running", { url: win.location.href });
	if (win.location.href.indexOf("bilibili.com/s/video/") !== -1) {
		console.log(ns, "[seed] redirecting /s/video/ to /video/");
		win.location.replace(win.location.href.replace("/s/", "/"));
		return;
	}
	const doc = win.document;
	const style = doc.createElement("style");
	style.textContent = `[class*="fullscreen"] #${HOST_ELEMENT_ID},[class*="webscreen-fix"] #${HOST_ELEMENT_ID} {z-index: 9!important;}`;
	(doc.head || doc.documentElement).appendChild(style);
	const script = doc.createElement("script");
	script.id = CONTENT_SCRIPT_ELEMENT_ID;
	script.type = "module";
	const { name, version } = chrome.runtime.getManifest();
	script.dataset.internals = JSON.stringify({
		baseUrl: chrome.runtime.getURL("/").replace(/\/$/, ""),
		manifest: {
			name,
			version
		}
	});
	script.src = chrome.runtime.getURL("bilibili-helper-content-script.js") + `?v=${version}`;
	(doc.head || doc.documentElement).appendChild(script);
	console.log(ns, "[seed] main script injected", {
		id: script.id,
		src: script.src
	});
})(window);
//#endregion
