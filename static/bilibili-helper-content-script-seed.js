//#region src/lib/constants.ts
var HOST_ELEMENT_ID = "bilibili-helper-host";
var CONTENT_SCRIPT_ELEMENT_ID = "bilibili-helper-ext-content-script";
//#endregion
//#region src/content-script/seed.ts
(function(win) {
	const ns = "[bilibili downloader]";
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
