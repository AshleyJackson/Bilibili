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
function forwardContentScriptErrorMessage(value) {
	if (isSentryErrorMessage(value) && value.source === "content-script") return sendSentryErrorMessage(value);
	return Promise.resolve(false);
}
var STREAM_FETCH_PORT_NAME = "bilibili-helper-stream-fetch";
var AKAMAI_STREAM_HOSTS = /* @__PURE__ */ new Set(["upos-hz-mirrorakam.akamaized.net", "upos-sz-mirrorakam.akamaized.net"]);
function isAllowedStreamUrl(value) {
	try {
		const url = new URL(value);
		const hostname = url.hostname.toLowerCase();
		const isBilibiliCdn = /^upos-[a-z0-9-]+\.bilivideo\.com$/.test(hostname) || AKAMAI_STREAM_HOSTS.has(hostname);
		return url.protocol === "https:" && !url.username && !url.password && (url.port === "" || url.port === "443") && isBilibiliCdn && /\.(?:m4s|mp4|flv)$/i.test(url.pathname);
	} catch {
		return false;
	}
}
function isPageStreamFetchRequest(value) {
	if (!value || typeof value !== "object") return false;
	const request = value;
	return request.source === "bilibili-helper-stream-fetch" && request.type === "request" && request.requestType === "bilibili-helper:stream-fetch" && typeof request.url === "string";
}
function isSequence(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isPageStreamControlMessage(value) {
	if (!value || typeof value !== "object") return false;
	const message = value;
	return message.type === "abort" || message.type === "ack" && isSequence(message.sequence);
}
function isStreamWorkerMessage(value) {
	if (!value || typeof value !== "object") return false;
	const message = value;
	switch (message.type) {
		case "response": return Number.isInteger(message.status) && typeof message.statusText === "string" && (message.contentLength === null || typeof message.contentLength === "string");
		case "chunk": return isSequence(message.sequence) && typeof message.data === "string";
		case "done": return true;
		case "error": return typeof message.message === "string";
		default: return false;
	}
}
function decodeBase64(value) {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes.buffer;
}
function decodeStreamWorkerChunk(message) {
	return {
		type: "chunk",
		sequence: message.sequence,
		buffer: decodeBase64(message.data)
	};
}
//#endregion
//#region src/content-script/seed.ts
function relayStreamFetch(pagePort, url) {
	let runtimePort;
	let terminal = false;
	const sendPageMessage = (message, transfer = []) => {
		try {
			pagePort.postMessage(message, transfer);
		} catch {
			runtimePort?.disconnect();
			pagePort.close();
		}
	};
	try {
		runtimePort = chrome.runtime.connect({ name: STREAM_FETCH_PORT_NAME });
	} catch (error) {
		sendPageMessage({
			type: "error",
			message: error instanceof Error ? error.message : String(error)
		});
		pagePort.close();
		return;
	}
	pagePort.onmessage = (event) => {
		if (isPageStreamControlMessage(event.data)) try {
			runtimePort.postMessage(event.data);
		} catch {
			runtimePort.disconnect();
		}
	};
	pagePort.onmessageerror = () => {
		try {
			runtimePort.postMessage({ type: "abort" });
		} catch {}
		runtimePort.disconnect();
		pagePort.close();
	};
	pagePort.start();
	runtimePort.onMessage.addListener((rawMessage) => {
		if (!isStreamWorkerMessage(rawMessage)) {
			terminal = true;
			sendPageMessage({
				type: "error",
				message: "Invalid response from extension worker"
			});
			runtimePort.disconnect();
			return;
		}
		if (rawMessage.type === "chunk") {
			try {
				const message = decodeStreamWorkerChunk(rawMessage);
				sendPageMessage(message, [message.buffer]);
			} catch (error) {
				terminal = true;
				sendPageMessage({
					type: "error",
					message: error instanceof Error ? error.message : String(error)
				});
				try {
					runtimePort.postMessage({ type: "abort" });
				} catch {}
				runtimePort.disconnect();
			}
			return;
		}
		if (rawMessage.type === "done" || rawMessage.type === "error") terminal = true;
		sendPageMessage(rawMessage);
	});
	runtimePort.onDisconnect.addListener(() => {
		if (!terminal) {
			const message = chrome.runtime.lastError?.message ?? "Extension stream worker disconnected";
			sendPageMessage({
				type: "error",
				message
			});
		}
	});
	runtimePort.postMessage({
		type: "fetch",
		url
	});
}
(function(win) {
	const ns = "[bilibili downloader]";
	win.addEventListener("message", (event) => {
		if (event.source !== win || event.origin !== win.location.origin || !isPageStreamFetchRequest(event.data) || event.ports.length !== 1) return;
		const pagePort = event.ports[0];
		if (!isAllowedStreamUrl(event.data.url)) {
			pagePort.postMessage({
				type: "error",
				message: "Unsupported Bilibili stream URL"
			});
			pagePort.close();
			return;
		}
		relayStreamFetch(pagePort, event.data.url);
	});
	win.addEventListener(CONTENT_SCRIPT_ERROR_EVENT, (event) => {
		const message = event.detail;
		if (!isSentryErrorMessage(message) || !message.error.stack?.includes("bilibili-helper-content-script")) return;
		forwardContentScriptErrorMessage(message);
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
