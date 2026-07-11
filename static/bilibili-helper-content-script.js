//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
//#endregion
//#region src/lib/constants.ts
var QUALITY_LABELS = {
	16: "360P 流畅",
	32: "480P 标清",
	64: "720P 准高清",
	80: "1080P 高清",
	112: "1080P 高码率",
	120: "4K 超高清",
	125: "HDR 真彩"
};
var HOST_ELEMENT_ID = "bilibili-helper-host";
var FFMPEG_WORKER = "ffmpeg.worker.js";
var FFMPEG_CORE_JS = "ffmpeg-core.js";
var FFMPEG_CORE_WASM = "ffmpeg-core.wasm";
var FFMPEG_CORE_WORKER = "ffmpeg-core.worker.js";
var UGC_PLAY_URL_API = "https://api.bilibili.com/x/player/wbi/playurl";
var BANGUMI_PLAY_URL_API = "https://api.bilibili.com/pgc/player/web/v2/playurl";
var NAV_API = "https://api.bilibili.com/x/web-interface/nav";
var SETTING_DOWNLOAD_MODE = "bilibili_helper_download_mode";
var SETTING_MERGE_MODE = "bilibili_helper_merge_mode";
var SETTING_SHOW = "bilibili_helper_show";
var FETCH_DEFAULTS = { credentials: "include" };
var STREAM_FETCH_DEFAULTS = {
	credentials: "include",
	referrer: "https://www.bilibili.com/",
	referrerPolicy: "unsafe-url"
};
var GB = 1024 * 1024 * 1024;
var MB = 1024 * 1024;
var KB = 1024;
//#endregion
//#region node_modules/zod/v4/core/core.js
var _a$1;
function $constructor(name, initializer, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__*/ Symbol("evaluating");
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
var propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
var NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return clone(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask) {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
var initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
var $ZodError = $constructor("$ZodError", initializer$1);
var $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
var duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
var uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/;
var number$1 = /^-?\d+(?:\.\d+)?$/;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;
//#endregion
//#region node_modules/zod/v4/core/checks.js
var $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
var $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
		else bag.exclusiveMaximum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
		else bag.exclusiveMinimum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		var _a;
		(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};
//#endregion
//#region node_modules/zod/v4/core/versions.js
var version = {
	major: 4,
	minor: 4,
	patch: 3
};
//#endregion
//#region node_modules/zod/v4/core/schemas.js
var $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
var $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
var $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
var $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
var $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
var $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			if (!def.normalize && def.protocol?.source === httpProtocol.source) {
				if (!/^https?:\/\//i.test(trimmed)) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid URL format",
						input: payload.value,
						inst,
						continue: !def.abort
					});
					return;
				}
			}
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
var $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
var $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
var $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
var $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
var $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
var $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
var $ZodAny = /*@__PURE__*/ $constructor("$ZodAny", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
var $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
var $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
var $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
	const isPresent = key in input;
	if (result.issues.length) {
		if (isOptionalIn && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && !isOptionalIn) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalIn = _catchall.optin === "optional";
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (key === "__proto__") continue;
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
var $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalIn = el._zod.optin === "optional";
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
var $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const schema = shape[key];
			const isOptionalIn = schema?._zod?.optin === "optional";
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx) => fn(shape, payload, ctx);
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
var $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
var $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
var $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
var $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			payload.fallback = true;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		payload.fallback = true;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (input === void 0 && (result.issues.length || result.fallback)) return {
		issues: [],
		value: void 0
	};
	return result;
}
var $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const input = payload.value;
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
			return handleOptionalResult(result, input);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
var $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
var $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => {
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
				payload.fallback = true;
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			payload.issues = [];
			payload.fallback = true;
		}
		return payload;
	};
});
var $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues,
		fallback: left.fallback
	}, ctx);
}
var $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
var $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _any(Class) {
	return new Class({ type: "any" });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process$1(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process$1(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) Object.assign(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const defUriPrefix = `#/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else Object.assign(schema, refSchema);
			Object.assign(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			defs[seen.defId] = seen.def;
		}
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
//#endregion
//#region node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
var stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
var numberProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) if (legacy) {
		json.minimum = exclusiveMinimum;
		json.exclusiveMinimum = true;
	} else json.exclusiveMinimum = exclusiveMinimum;
	else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) if (legacy) {
		json.maximum = exclusiveMaximum;
		json.exclusiveMaximum = true;
	} else json.exclusiveMaximum = exclusiveMaximum;
	else if (typeof maximum === "number") json.maximum = maximum;
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
var neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
var enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
var customProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process$1(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
var objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process$1(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process$1(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
var unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process$1(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
var intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process$1(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process$1(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
};
var nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	process$1(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
//#endregion
//#region node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date(params) {
	return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
var ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
var ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
//#endregion
//#region node_modules/zod/v4/classic/errors.js
var initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue) => {
			inst.issues.push(issue);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues) => {
			inst.issues.push(...issues);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
var ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
//#endregion
//#region node_modules/zod/v4/classic/parse.js
var parse = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
	const proto = Object.getPrototypeOf(inst);
	let installed = _installedGroups.get(proto);
	if (!installed) {
		installed = /* @__PURE__ */ new Set();
		_installedGroups.set(proto, installed);
	}
	if (installed.has(group)) return;
	installed.add(group);
	for (const key in methods) {
		const fn = methods[key];
		Object.defineProperty(proto, key, {
			configurable: true,
			enumerable: false,
			get() {
				const bound = fn.bind(this);
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: bound
				});
				return bound;
			},
			set(v) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: v
				});
			}
		});
	}
}
var ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	_installLazyMethods(inst, "ZodType", {
		check(...chks) {
			const def = this.def;
			return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)] }), { parent: true });
		},
		with(...chks) {
			return this.check(...chks);
		},
		clone(def, params) {
			return clone(this, def, params);
		},
		brand() {
			return this;
		},
		register(reg, meta) {
			reg.add(this, meta);
			return this;
		},
		refine(check, params) {
			return this.check(refine(check, params));
		},
		superRefine(refinement, params) {
			return this.check(superRefine(refinement, params));
		},
		overwrite(fn) {
			return this.check(/* @__PURE__ */ _overwrite(fn));
		},
		optional() {
			return optional(this);
		},
		exactOptional() {
			return exactOptional(this);
		},
		nullable() {
			return nullable(this);
		},
		nullish() {
			return optional(nullable(this));
		},
		nonoptional(params) {
			return nonoptional(this, params);
		},
		array() {
			return array(this);
		},
		or(arg) {
			return union([this, arg]);
		},
		and(arg) {
			return intersection(this, arg);
		},
		transform(tx) {
			return pipe(this, transform(tx));
		},
		default(d) {
			return _default(this, d);
		},
		prefault(d) {
			return prefault(this, d);
		},
		catch(params) {
			return _catch(this, params);
		},
		pipe(target) {
			return pipe(this, target);
		},
		readonly() {
			return readonly(this);
		},
		describe(description) {
			const cl = this.clone();
			globalRegistry.add(cl, { description });
			return cl;
		},
		meta(...args) {
			if (args.length === 0) return globalRegistry.get(this);
			const cl = this.clone();
			globalRegistry.add(cl, args[0]);
			return cl;
		},
		isOptional() {
			return this.safeParse(void 0).success;
		},
		isNullable() {
			return this.safeParse(null).success;
		},
		apply(fn) {
			return fn(this);
		}
	});
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	return inst;
});
/** @internal */
var _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	_installLazyMethods(inst, "_ZodString", {
		regex(...args) {
			return this.check(/* @__PURE__ */ _regex(...args));
		},
		includes(...args) {
			return this.check(/* @__PURE__ */ _includes(...args));
		},
		startsWith(...args) {
			return this.check(/* @__PURE__ */ _startsWith(...args));
		},
		endsWith(...args) {
			return this.check(/* @__PURE__ */ _endsWith(...args));
		},
		min(...args) {
			return this.check(/* @__PURE__ */ _minLength(...args));
		},
		max(...args) {
			return this.check(/* @__PURE__ */ _maxLength(...args));
		},
		length(...args) {
			return this.check(/* @__PURE__ */ _length(...args));
		},
		nonempty(...args) {
			return this.check(/* @__PURE__ */ _minLength(1, ...args));
		},
		lowercase(params) {
			return this.check(/* @__PURE__ */ _lowercase(params));
		},
		uppercase(params) {
			return this.check(/* @__PURE__ */ _uppercase(params));
		},
		trim() {
			return this.check(/* @__PURE__ */ _trim());
		},
		normalize(...args) {
			return this.check(/* @__PURE__ */ _normalize(...args));
		},
		toLowerCase() {
			return this.check(/* @__PURE__ */ _toLowerCase());
		},
		toUpperCase() {
			return this.check(/* @__PURE__ */ _toUpperCase());
		},
		slugify() {
			return this.check(/* @__PURE__ */ _slugify());
		}
	});
});
var ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
	inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
	inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
var ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
var ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	_installLazyMethods(inst, "ZodNumber", {
		gt(value, params) {
			return this.check(/* @__PURE__ */ _gt(value, params));
		},
		gte(value, params) {
			return this.check(/* @__PURE__ */ _gte(value, params));
		},
		min(value, params) {
			return this.check(/* @__PURE__ */ _gte(value, params));
		},
		lt(value, params) {
			return this.check(/* @__PURE__ */ _lt(value, params));
		},
		lte(value, params) {
			return this.check(/* @__PURE__ */ _lte(value, params));
		},
		max(value, params) {
			return this.check(/* @__PURE__ */ _lte(value, params));
		},
		int(params) {
			return this.check(int(params));
		},
		safe(params) {
			return this.check(int(params));
		},
		positive(params) {
			return this.check(/* @__PURE__ */ _gt(0, params));
		},
		nonnegative(params) {
			return this.check(/* @__PURE__ */ _gte(0, params));
		},
		negative(params) {
			return this.check(/* @__PURE__ */ _lt(0, params));
		},
		nonpositive(params) {
			return this.check(/* @__PURE__ */ _lte(0, params));
		},
		multipleOf(value, params) {
			return this.check(/* @__PURE__ */ _multipleOf(value, params));
		},
		step(value, params) {
			return this.check(/* @__PURE__ */ _multipleOf(value, params));
		},
		finite() {
			return this;
		}
	});
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
var ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
var ZodAny = /*@__PURE__*/ $constructor("ZodAny", (inst, def) => {
	$ZodAny.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function any() {
	return /* @__PURE__ */ _any(ZodAny);
}
var ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
var ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
var ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
	_installLazyMethods(inst, "ZodArray", {
		min(n, params) {
			return this.check(/* @__PURE__ */ _minLength(n, params));
		},
		nonempty(params) {
			return this.check(/* @__PURE__ */ _minLength(1, params));
		},
		max(n, params) {
			return this.check(/* @__PURE__ */ _maxLength(n, params));
		},
		length(n, params) {
			return this.check(/* @__PURE__ */ _length(n, params));
		},
		unwrap() {
			return this.element;
		}
	});
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
var ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	_installLazyMethods(inst, "ZodObject", {
		keyof() {
			return _enum(Object.keys(this._zod.def.shape));
		},
		catchall(catchall) {
			return this.clone({
				...this._zod.def,
				catchall
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: never()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(incoming) {
			return extend(this, incoming);
		},
		safeExtend(incoming) {
			return safeExtend(this, incoming);
		},
		merge(other) {
			return merge(this, other);
		},
		pick(mask) {
			return pick(this, mask);
		},
		omit(mask) {
			return omit(this, mask);
		},
		partial(...args) {
			return partial(ZodOptional, this, args[0]);
		},
		required(...args) {
			return required(ZodNonOptional, this, args[0]);
		}
	});
});
function object(shape, params) {
	return new ZodObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
var ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
var ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
var ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	return new ZodEnum({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
		...normalizeParams(params)
	});
}
var ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			payload.fallback = true;
			return payload;
		});
		payload.value = output;
		payload.fallback = true;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
var ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
var ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
var ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
var ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
var ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
var ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
var ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
var ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
}
//#endregion
//#region src/lib/schemas.ts
var ErrorCode = {
	OK: 0,
	FAILED_TO_FETCH: -1,
	INVALID_RESPONSE: -2,
	VIP_ONLY: -10403,
	UNKNOWN: -99999
};
object({
	aid: number(),
	bvid: string(),
	cid: number(),
	title: string(),
	pages: array(object({
		page: number(),
		part: string(),
		cid: number()
	})),
	videoData: object({
		aid: number(),
		bvid: string(),
		cid: number(),
		title: string(),
		pages: array(object({
			page: number(),
			part: string(),
			cid: number()
		}))
	})
});
var DashStreamSchema = object({
	id: number(),
	base_url: string().optional(),
	baseUrl: string().optional(),
	backup_url: array(string()).optional(),
	backupUrl: array(string()).optional(),
	codecid: number().optional(),
	codecs: string().optional(),
	bandwidth: number().optional(),
	mimeType: string().optional(),
	width: number().optional(),
	height: number().optional(),
	size: number().optional()
}).refine((v) => v.base_url || v.baseUrl, { message: "must have base_url or baseUrl" });
var DashDataSchema = object({
	audio: array(DashStreamSchema),
	video: array(DashStreamSchema)
});
var DurlSegmentSchema = object({
	url: string(),
	backup_url: array(string()).optional(),
	size: number().optional()
});
object({
	code: number(),
	message: string().optional(),
	data: object({
		dash: DashDataSchema.optional(),
		durl: array(DurlSegmentSchema).optional(),
		accept_quality: array(number()).optional(),
		accept_description: array(string()).optional(),
		video_codecid: number().optional(),
		support_formats: array(object({
			quality: number(),
			new_description: string().optional(),
			display_desc: string().optional()
		})).optional()
	}).optional()
});
object({
	code: number(),
	data: any().optional(),
	message: string().optional()
});
object({
	code: number(),
	dash: object({
		audio: DashStreamSchema,
		video: DashStreamSchema
	}).optional(),
	durl: array(DurlSegmentSchema).optional(),
	qualityDescription: string().optional()
});
object({
	downloadMode: _enum(["advanced", "normal"]),
	mergeMode: _enum(["on", "off"]),
	show: _enum(["show", "hide"])
});
//#endregion
//#region src/lib/utils.ts
var isBilibili = () => location.hostname === "www.bilibili.com" || location.hostname === "bilibili.com";
var isEdge = () => window.navigator.userAgent.indexOf("Edg/") !== -1;
var isVideoPage = () => /\/video\/(av|bv)[0-9a-zA-Z]+/i.test(window.location.pathname);
var isBangumiPage = () => /\/bangumi\/play\/\S+/i.test(window.location.pathname);
function formatSize(bytes) {
	if (!bytes) return "未知大小";
	if (bytes >= 1073741824) return `${(bytes / GB).toFixed(2)}GB`;
	if (bytes >= 1048576) return `${(bytes / MB).toFixed(2)}MB`;
	if (bytes >= 1024) return `${(bytes / KB).toFixed(2)}KB`;
	return `${bytes}B`;
}
function isAdvancedMode() {
	return localStorage.getItem(SETTING_DOWNLOAD_MODE) !== "normal";
}
function isMergeMode() {
	return localStorage.getItem(SETTING_MERGE_MODE) !== "off";
}
function isHidden() {
	return localStorage.getItem(SETTING_SHOW) === "hide";
}
function getInternals() {
	const el = document.getElementById("bilibili-helper-ext-content-script");
	const { manifest, baseUrl } = JSON.parse(el.dataset.internals);
	return {
		...manifest,
		baseUrl
	};
}
function waitForElement(selector) {
	return new Promise((resolve) => {
		let count = 0;
		const interval = setInterval(() => {
			count++;
			const el = document.querySelector(selector);
			if (el || count > 100) {
				clearInterval(interval);
				resolve(el);
			}
		}, 300);
	});
}
function downloadBlob(data, filename, container, onDone) {
	const blob = new Blob([data], { type: "application/octet-stream" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.setAttribute("href", url);
	anchor.setAttribute("download", filename);
	anchor.setAttribute("style", "margin-left:10px");
	anchor.innerHTML = "（如果没有弹出下载，请点击这里保存）";
	container.appendChild(anchor);
	anchor.click();
	onDone?.();
}
//#endregion
//#region src/lib/ui.ts
var SHADOW_STYLES = `p,
a,
div,
span,
li,
i,
b,
strong,
input,
button,
label {
  font-size: inherit;
}
li {
  margin-bottom: 5px;
}
p {
  margin: 0;
  line-height: 1.5;
}
h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
h3 {
  font-size: 16px;
  margin: 1em 0;
}
#title {
  font-size: 16px;
  font-weight: normal;
}
#content {
  display: flex;
  width: 100%;
  font-size: 14px;
  position: relative;
}
a {
  color: #00a1d6 !important;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
a.disabled {
  color: #666 !important;
}
a.disabled:hover {
  text-decoration: none;
  cursor: not-allowed;
}
#side-bar {
  flex: 3;
  padding: 20px;
  border-right: 1px solid #ccc;
  margin-right: -1px;
}
#main {
  flex: 7;
  padding: 20px;
  border-left: 1px solid #ccc;
}
#notice-frame {
  width: 100%;
  padding: 0;
}
.donate {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
#zanshang {
  width: 80%;
}
.setting-item {
  margin-bottom: 8px;
}
.setting-item .label {
  font-weight: bold;
  width: 6em;
  display: inline-block;
  text-align: right;
}
.desc {
  padding-left: 6em;
}
#actions {
  position: absolute;
  right: 0;
  top: 0;
}
.btn-large {
  border: 0 none;
  background: #f45a8d;
  border-radius: 6px;
  color: #fff;
  padding: 10px 20px;
}
#toggle {
  border-radius: 0 0 0 6px;
  outline: none;
  cursor: pointer;
}
.hide #side-bar {
  display: none;
}
.hide #main {
  display: none;
}
.hide #toggle {
  border-radius: 6px 0 0 0;
}
.hide #actions {
  position: static;
}

a.btn {
  border: 0 none;
  background: #f45a8d;
  text-decoration: none !important;
  color: #fff !important;
  border-radius: 3px;
  padding: 5px 10px;
  display: inline-block;
}
.settings {
  border-left: 5px solid #ccc;
  background: #eee;
  padding: 16px 16px 8px 0;
}
.size {
  margin: 0 5px;
}
#bilibliHelperLogs {
  margin-top: 10px;
  max-width: 600px;
  max-height: 400px;
  overflow: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  line-height: 1.2;
  background: rgb(50, 50, 50);
  color: rgb(154, 180, 90);
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  font-size: 11px;
}
`;
var SETTINGS_HTML = `<h1 style="margin-top: 0;">B站下载助手</h1>
<p style="margin-bottom: 10px;"><a target="_blank" href="https://docs.qq.com/doc/DQ2lhaWRpS0tubVVF">使用教程及常见问题解答</a></p>
<div class="settings">
  <div class="setting-item">
    <span class="label">清晰度：</span>
    <span>请在页面中B站自己的播放器内切换清晰度</span>
  </div>
  <div class="setting-item">
    <span class="label">下载模式：</span>
    <label><input id="setting-download-mode-advanced" checked name="setting-download-mode" type="radio" /> 高级</label>
    <label><input id="setting-download-mode-normal" name="setting-download-mode" type="radio" /> 兼容</label>
    <p class="desc">高级模式支持自动重命名和合并下载，但会占用较大的系统运行内存<br />兼容模式直接使用浏览器的默认下载，资源占用很小，但不支持自动重命名和合并下载</p>
  </div>
  <div class="setting-item" id="setting-advanced">
    <span class="label">合并下载：</span>
    <label><input id="setting-merge-on" checked name="setting-merge" type="radio"> 开</label>
    <label><input id="setting-merge-off" name="setting-merge" type="radio"> 关</label>
    <p class="desc">高级模式下载过程中请<strong style="color: red;">不要</strong>刷新或关闭页面，也<strong
        style="color: red;">不要</strong>切换分集和清晰度</p>
  </div>
</div>`;
var LOADING_SPINNER = " <svg style=\"vertical-align: middle\" width=\"50px\" height=\"50px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"lds-pacman\"><g ng-attr-style=\"display:{{config.showBean}}\" style=\"display:block\"><circle cx=\"62.0973\" cy=\"50\" r=\"4\" ng-attr-fill=\"{{config.c2}}\" fill=\"#00a1d6\"><animate attributeName=\"cx\" calcMode=\"linear\" values=\"95;35\" keyTimes=\"0;1\" dur=\"1\" begin=\"-0.67s\" repeatCount=\"indefinite\"></animate><animate attributeName=\"fill-opacity\" calcMode=\"linear\" values=\"0;1;1\" keyTimes=\"0;0.2;1\" dur=\"1\" begin=\"-0.67s\" repeatCount=\"indefinite\"></animate></circle><circle cx=\"82.4973\" cy=\"50\" r=\"4\" ng-attr-fill=\"{{config.c2}}\" fill=\"#00a1d6\"><animate attributeName=\"cx\" calcMode=\"linear\" values=\"95;35\" keyTimes=\"0;1\" dur=\"1\" begin=\"-0.33s\" repeatCount=\"indefinite\"></animate><animate attributeName=\"fill-opacity\" calcMode=\"linear\" values=\"0;1;1\" keyTimes=\"0;0.2;1\" dur=\"1\" begin=\"-0.33s\" repeatCount=\"indefinite\"></animate></circle><circle cx=\"42.2973\" cy=\"50\" r=\"4\" ng-attr-fill=\"{{config.c2}}\" fill=\"#00a1d6\"><animate attributeName=\"cx\" calcMode=\"linear\" values=\"95;35\" keyTimes=\"0;1\" dur=\"1\" begin=\"0s\" repeatCount=\"indefinite\"></animate><animate attributeName=\"fill-opacity\" calcMode=\"linear\" values=\"0;1;1\" keyTimes=\"0;0.2;1\" dur=\"1\" begin=\"0s\" repeatCount=\"indefinite\"></animate></circle></g><g ng-attr-transform=\"translate({{config.showBeanOffset}} 0)\" transform=\"translate(-15 0)\"><path d=\"M50 50L20 50A30 30 0 0 0 80 50Z\" ng-attr-fill=\"{{config.c1}}\" fill=\"#f45a8d\" transform=\"rotate(10.946 50 50)\"><animateTransform attributeName=\"transform\" type=\"rotate\" calcMode=\"linear\" values=\"0 50 50;45 50 50;0 50 50\" keyTimes=\"0;0.5;1\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\"></animateTransform></path><path d=\"M50 50L20 50A30 30 0 0 1 80 50Z\" ng-attr-fill=\"{{config.c1}}\" fill=\"#f45a8d\" transform=\"rotate(-10.946 50 50)\"><animateTransform attributeName=\"transform\" type=\"rotate\" calcMode=\"linear\" values=\"0 50 50;-45 50 50;0 50 50\" keyTimes=\"0;0.5;1\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\"></animateTransform></path></g></svg>";
function getReviewUrl() {
	return isEdge() ? "https://microsoftedge.microsoft.com/addons/detail/cagicamgdlbdmonbclkpgiabbldodgae" : "https://chromewebstore.google.com/detail/bfcbfobhcjbkilcbehlnlchiinokiijp";
}
//#endregion
//#region src/lib/logger.ts
var LEVEL_PREFIX = {
	info: "",
	warn: "[WARN]",
	error: "[ERROR]"
};
/**
* Format a UTC timestamp for log messages.
* Returns "HH:MM:SS.mmm" so multiple messages in the same second are distinguishable.
*/
function timestamp() {
	const d = /* @__PURE__ */ new Date();
	return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0") + "." + String(d.getMilliseconds()).padStart(3, "0");
}
/** Map a severity level to the appropriate console method. */
var consoleMethod = {
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
function log$1(module, level, ...args) {
	const prefix = `[${timestamp()}][${module}]${LEVEL_PREFIX[level] ? " " + LEVEL_PREFIX[level] : ""}`;
	consoleMethod[level]("[bilibili downloader]", prefix, ...args);
	try {
		const el = document.getElementById("bilibili-helper-host");
		if (!el?.shadowRoot) return;
		const logs = el.shadowRoot.querySelector("#bilibliHelperLogs");
		if (!logs) return;
		const line = args.map((a) => {
			if (typeof a === "object") try {
				return JSON.stringify(a);
			} catch {
				return String(a);
			}
			return String(a);
		}).join(" ");
		logs.innerHTML += `<p>${prefix} ${line}</p>`;
	} catch {}
}
function logInfo(module, ...args) {
	log$1(module, "info", ...args);
}
function logWarn(module, ...args) {
	log$1(module, "warn", ...args);
}
function logError(module, ...args) {
	log$1(module, "error", ...args);
}
/**
* Convenience: log a fetch attempt including URL method, status code, and duration.
*
* Call immediately before fetch, then invoke the returned function with the response
* (or null on error).
*/
function logFetch(module, url, method) {
	const start = performance.now();
	const short = url.length > 120 ? url.slice(0, 120) + "..." : url;
	logInfo(module, `${method} ${short}`);
	return (res) => {
		const ms = Math.round(performance.now() - start);
		if (res) logInfo(module, `${method} ${res.status} in ${ms}ms (${short})`);
		else logError(module, `${method} failed after ${ms}ms (${short})`);
	};
}
//#endregion
//#region src/lib/fetch-utils.ts
var MODULE$5 = "fetch";
/**
* Fetch a URL and return its contents as an ArrayBuffer.
* Supports progress callbacks via streaming.
*/
async function fetchWithProgress(url, onProgress) {
	const response = await fetch(url, STREAM_FETCH_DEFAULTS);
	let result;
	try {
		const contentLength = parseInt(response.headers.get("Content-Length") ?? "-1", 10);
		if (contentLength > 0) logInfo(MODULE$5, "fetchWithProgress: streaming", {
			url: url.slice(0, 80),
			contentLength
		});
		const reader = response.body?.getReader();
		if (!reader) throw new Error("failed to get response body reader");
		const chunks = [];
		let received = 0;
		for (;;) {
			const { done, value } = await reader.read();
			const delta = value ? value.length : 0;
			if (done) {
				if (contentLength !== -1 && contentLength !== received) throw new Error("failed to complete download");
				onProgress?.({
					url,
					total: contentLength,
					received,
					delta,
					done: true
				});
				break;
			}
			chunks.push(value);
			received += delta;
			onProgress?.({
				url,
				total: contentLength,
				received,
				delta,
				done: false
			});
		}
		const merged = new Uint8Array(received);
		let offset = 0;
		for (const chunk of chunks) {
			merged.set(chunk, offset);
			offset += chunk.length;
		}
		result = merged.buffer;
	} catch (err) {
		logWarn(MODULE$5, "streaming failed, falling back to arrayBuffer", err);
		result = await response.arrayBuffer();
		onProgress?.({
			url,
			total: result.byteLength,
			received: result.byteLength,
			delta: 0,
			done: true
		});
	}
	return result;
}
/**
* Fetch and return as a Blob, optionally streaming with progress.
*/
async function fetchAsBlob(url, mimeType, streaming = false, onProgress) {
	logInfo(MODULE$5, "fetchAsBlob", {
		url: url.slice(0, 80),
		mimeType,
		streaming
	});
	const data = streaming ? await fetchWithProgress(url, onProgress) : await (await fetch(url, STREAM_FETCH_DEFAULTS)).arrayBuffer();
	const blob = new Blob([data], { type: mimeType });
	const blobUrl = URL.createObjectURL(blob);
	logInfo(MODULE$5, "fetchAsBlob: blob created", {
		blobUrl: blobUrl.slice(0, 40),
		size: data.byteLength
	});
	return blobUrl;
}
/**
* Stream a download with progress updates and return the Blob.
*/
async function streamDownload(url, expectedSize, onProgress) {
	logInfo(MODULE$5, "streamDownload: start", {
		url: url.slice(0, 80),
		expectedSize
	});
	const response = await window.fetch(url, STREAM_FETCH_DEFAULTS);
	if (!response.ok) {
		logError(MODULE$5, "streamDownload: HTTP error", {
			url: url.slice(0, 80),
			status: response.status,
			statusText: response.statusText
		});
		throw new Error(`HTTP ${response.status} ${response.statusText}`);
	}
	const contentLength = expectedSize ?? parseInt(response.headers.get("content-length") ?? "0", 10);
	let received = 0;
	const reader = response.body.getReader();
	const buffer = await new Response(new ReadableStream({ start(controller) {
		const pump = () => {
			reader.read().then(({ done, value }) => {
				if (done) {
					controller.close();
					return;
				}
				received += value.byteLength;
				onProgress(received, contentLength);
				controller.enqueue(value);
				pump();
			}).catch((err) => controller.error(err));
		};
		pump();
	} })).arrayBuffer();
	const blob = new Blob([buffer]);
	logInfo(MODULE$5, "streamDownload: complete", {
		url: url.slice(0, 80),
		received,
		blobSize: blob.size
	});
	return blob;
}
/**
* Convert various input types to Uint8Array.
*/
async function toUint8Array(input) {
	if (typeof input === "string") {
		const match = /data:([a-zA-Z]+\/[a-zA-Z0-9.+-]+);base64,(.*)/.exec(input);
		if (match) {
			const binary = atob(match[2]);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
			logInfo(MODULE$5, "toUint8Array: decoded base64 data URI", { size: bytes.length });
			return bytes;
		}
		const done = logFetch(MODULE$5, input.slice(0, 120), "GET");
		let response;
		try {
			response = await fetch(input, STREAM_FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			throw err;
		}
		done(response);
		const buf = await response.arrayBuffer();
		logInfo(MODULE$5, "toUint8Array: fetched", { size: buf.byteLength });
		return new Uint8Array(buf);
	}
	if (input instanceof URL) {
		const done = logFetch(MODULE$5, input.toString(), "GET");
		let response;
		try {
			response = await fetch(input, STREAM_FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			throw err;
		}
		done(response);
		const buf = await response.arrayBuffer();
		logInfo(MODULE$5, "toUint8Array: fetched URL", { size: buf.byteLength });
		return new Uint8Array(buf);
	}
	logInfo(MODULE$5, "toUint8Array: reading File/Blob", {
		type: input.type,
		size: input.size
	});
	return fileToUint8Array(input);
}
function fileToUint8Array(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const { result } = reader;
			if (result instanceof ArrayBuffer) resolve(new Uint8Array(result));
			else resolve(/* @__PURE__ */ new Uint8Array());
		};
		reader.onerror = (ev) => {
			reject(Error(`File could not be read! Code=${(ev?.target?.error)?.code ?? -1}`));
		};
		reader.readAsArrayBuffer(file);
	});
}
var FFMessageType;
(function(FFMessageType) {
	FFMessageType["LOAD"] = "LOAD";
	FFMessageType["EXEC"] = "EXEC";
	FFMessageType["FFPROBE"] = "FFPROBE";
	FFMessageType["WRITE_FILE"] = "WRITE_FILE";
	FFMessageType["READ_FILE"] = "READ_FILE";
	FFMessageType["DELETE_FILE"] = "DELETE_FILE";
	FFMessageType["RENAME"] = "RENAME";
	FFMessageType["CREATE_DIR"] = "CREATE_DIR";
	FFMessageType["LIST_DIR"] = "LIST_DIR";
	FFMessageType["DELETE_DIR"] = "DELETE_DIR";
	FFMessageType["ERROR"] = "ERROR";
	FFMessageType["DOWNLOAD"] = "DOWNLOAD";
	FFMessageType["PROGRESS"] = "PROGRESS";
	FFMessageType["LOG"] = "LOG";
	FFMessageType["MOUNT"] = "MOUNT";
	FFMessageType["UNMOUNT"] = "UNMOUNT";
})(FFMessageType || (FFMessageType = {}));
//#endregion
//#region node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js
/**
* Generate an unique message ID.
*/
var getMessageID = (() => {
	let messageID = 0;
	return () => messageID++;
})();
//#endregion
//#region node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js
var ERROR_NOT_LOADED = /* @__PURE__ */ new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
var ERROR_TERMINATED = /* @__PURE__ */ new Error("called FFmpeg.terminate()");
//#endregion
//#region node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js
/**
* Provides APIs to interact with ffmpeg web worker.
*
* @example
* ```ts
* const ffmpeg = new FFmpeg();
* ```
*/
var FFmpeg = class {
	#worker = null;
	/**
	* #resolves and #rejects tracks Promise resolves and rejects to
	* be called when we receive message from web worker.
	*/
	#resolves = {};
	#rejects = {};
	#logEventCallbacks = [];
	#progressEventCallbacks = [];
	loaded = false;
	/**
	* register worker message event handlers.
	*/
	#registerHandlers = () => {
		if (this.#worker) this.#worker.onmessage = ({ data: { id, type, data } }) => {
			switch (type) {
				case FFMessageType.LOAD:
					this.loaded = true;
					this.#resolves[id](data);
					break;
				case FFMessageType.MOUNT:
				case FFMessageType.UNMOUNT:
				case FFMessageType.EXEC:
				case FFMessageType.FFPROBE:
				case FFMessageType.WRITE_FILE:
				case FFMessageType.READ_FILE:
				case FFMessageType.DELETE_FILE:
				case FFMessageType.RENAME:
				case FFMessageType.CREATE_DIR:
				case FFMessageType.LIST_DIR:
				case FFMessageType.DELETE_DIR:
					this.#resolves[id](data);
					break;
				case FFMessageType.LOG:
					this.#logEventCallbacks.forEach((f) => f(data));
					break;
				case FFMessageType.PROGRESS:
					this.#progressEventCallbacks.forEach((f) => f(data));
					break;
				case FFMessageType.ERROR:
					this.#rejects[id](data);
					break;
			}
			delete this.#resolves[id];
			delete this.#rejects[id];
		};
	};
	/**
	* Generic function to send messages to web worker.
	*/
	#send = ({ type, data }, trans = [], signal) => {
		if (!this.#worker) return Promise.reject(ERROR_NOT_LOADED);
		return new Promise((resolve, reject) => {
			const id = getMessageID();
			this.#worker && this.#worker.postMessage({
				id,
				type,
				data
			}, trans);
			this.#resolves[id] = resolve;
			this.#rejects[id] = reject;
			signal?.addEventListener("abort", () => {
				reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
			}, { once: true });
		});
	};
	on(event, callback) {
		if (event === "log") this.#logEventCallbacks.push(callback);
		else if (event === "progress") this.#progressEventCallbacks.push(callback);
	}
	off(event, callback) {
		if (event === "log") this.#logEventCallbacks = this.#logEventCallbacks.filter((f) => f !== callback);
		else if (event === "progress") this.#progressEventCallbacks = this.#progressEventCallbacks.filter((f) => f !== callback);
	}
	/**
	* Loads ffmpeg-core inside web worker. It is required to call this method first
	* as it initializes WebAssembly and other essential variables.
	*
	* @category FFmpeg
	* @returns `true` if ffmpeg core is loaded for the first time.
	*/
	load = ({ classWorkerURL, ...config } = {}, { signal } = {}) => {
		if (!this.#worker) {
			this.#worker = classWorkerURL ? new Worker(new URL(classWorkerURL, import.meta.url), { type: "module" }) : new Worker(new URL(
				/* @vite-ignore */
				"/assets/worker-BZ_EOCZe.js",
				"" + import.meta.url
			), { type: "module" });
			this.#registerHandlers();
		}
		return this.#send({
			type: FFMessageType.LOAD,
			data: config
		}, void 0, signal);
	};
	/**
	* Execute ffmpeg command.
	*
	* @remarks
	* To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
	* by default.
	*
	* @example
	* ```ts
	* const ffmpeg = new FFmpeg();
	* await ffmpeg.load();
	* await ffmpeg.writeFile("video.avi", ...);
	* // ffmpeg -i video.avi video.mp4
	* await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
	* const data = ffmpeg.readFile("video.mp4");
	* ```
	*
	* @returns `0` if no error, `!= 0` if timeout (1) or error.
	* @category FFmpeg
	*/
	exec = (args, timeout = -1, { signal } = {}) => this.#send({
		type: FFMessageType.EXEC,
		data: {
			args,
			timeout
		}
	}, void 0, signal);
	/**
	* Execute ffprobe command.
	*
	* @example
	* ```ts
	* const ffmpeg = new FFmpeg();
	* await ffmpeg.load();
	* await ffmpeg.writeFile("video.avi", ...);
	* // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
	* await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
	* const data = ffmpeg.readFile("output.txt");
	* ```
	*
	* @returns `0` if no error, `!= 0` if timeout (1) or error.
	* @category FFmpeg
	*/
	ffprobe = (args, timeout = -1, { signal } = {}) => this.#send({
		type: FFMessageType.FFPROBE,
		data: {
			args,
			timeout
		}
	}, void 0, signal);
	/**
	* Terminate all ongoing API calls and terminate web worker.
	* `FFmpeg.load()` must be called again before calling any other APIs.
	*
	* @category FFmpeg
	*/
	terminate = () => {
		const ids = Object.keys(this.#rejects);
		for (const id of ids) {
			this.#rejects[id](ERROR_TERMINATED);
			delete this.#rejects[id];
			delete this.#resolves[id];
		}
		if (this.#worker) {
			this.#worker.terminate();
			this.#worker = null;
			this.loaded = false;
		}
	};
	/**
	* Write data to ffmpeg.wasm.
	*
	* @example
	* ```ts
	* const ffmpeg = new FFmpeg();
	* await ffmpeg.load();
	* await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
	* await ffmpeg.writeFile("text.txt", "hello world");
	* ```
	*
	* @category File System
	*/
	writeFile = (path, data, { signal } = {}) => {
		const trans = [];
		if (data instanceof Uint8Array) trans.push(data.buffer);
		return this.#send({
			type: FFMessageType.WRITE_FILE,
			data: {
				path,
				data
			}
		}, trans, signal);
	};
	mount = (fsType, options, mountPoint) => {
		return this.#send({
			type: FFMessageType.MOUNT,
			data: {
				fsType,
				options,
				mountPoint
			}
		}, []);
	};
	unmount = (mountPoint) => {
		return this.#send({
			type: FFMessageType.UNMOUNT,
			data: { mountPoint }
		}, []);
	};
	/**
	* Read data from ffmpeg.wasm.
	*
	* @example
	* ```ts
	* const ffmpeg = new FFmpeg();
	* await ffmpeg.load();
	* const data = await ffmpeg.readFile("video.mp4");
	* ```
	*
	* @category File System
	*/
	readFile = (path, encoding = "binary", { signal } = {}) => this.#send({
		type: FFMessageType.READ_FILE,
		data: {
			path,
			encoding
		}
	}, void 0, signal);
	/**
	* Delete a file.
	*
	* @category File System
	*/
	deleteFile = (path, { signal } = {}) => this.#send({
		type: FFMessageType.DELETE_FILE,
		data: { path }
	}, void 0, signal);
	/**
	* Rename a file or directory.
	*
	* @category File System
	*/
	rename = (oldPath, newPath, { signal } = {}) => this.#send({
		type: FFMessageType.RENAME,
		data: {
			oldPath,
			newPath
		}
	}, void 0, signal);
	/**
	* Create a directory.
	*
	* @category File System
	*/
	createDir = (path, { signal } = {}) => this.#send({
		type: FFMessageType.CREATE_DIR,
		data: { path }
	}, void 0, signal);
	/**
	* List directory contents.
	*
	* @category File System
	*/
	listDir = (path, { signal } = {}) => this.#send({
		type: FFMessageType.LIST_DIR,
		data: { path }
	}, void 0, signal);
	/**
	* Delete an empty directory.
	*
	* @category File System
	*/
	deleteDir = (path, { signal } = {}) => this.#send({
		type: FFMessageType.DELETE_DIR,
		data: { path }
	}, void 0, signal);
};
//#endregion
//#region node_modules/@ffmpeg/ffmpeg/dist/esm/types.js
var FFFSType;
(function(FFFSType) {
	FFFSType["MEMFS"] = "MEMFS";
	FFFSType["NODEFS"] = "NODEFS";
	FFFSType["NODERAWFS"] = "NODERAWFS";
	FFFSType["IDBFS"] = "IDBFS";
	FFFSType["WORKERFS"] = "WORKERFS";
	FFFSType["PROXYFS"] = "PROXYFS";
})(FFFSType || (FFFSType = {}));
//#endregion
//#region src/lib/ffmpeg.ts
var ffmpegInstance = null;
var usedFiles = /* @__PURE__ */ new Set();
var blobUrls = /* @__PURE__ */ new Set();
function trackBlobUrl(url) {
	blobUrls.add(url);
}
async function getFFmpeg(baseUrl) {
	if (ffmpegInstance) {
		logInfo("ffmpeg", "reusing existing FFmpeg instance");
		return ffmpegInstance;
	}
	logInfo("ffmpeg", "initializing new FFmpeg instance");
	const inst = new FFmpeg();
	inst.on("log", ({ message }) => {
		console.log("[bilibili downloader]", "[ffmpeg]", message);
	});
	logInfo("ffmpeg", "fetching FFmpeg assets from", baseUrl);
	const [workerUrl, coreJsUrl, wasmUrl, coreWorkerUrl] = await Promise.all([
		fetchAsBlob(`${baseUrl}/${FFMPEG_WORKER}`, "text/javascript"),
		fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_JS}`, "text/javascript"),
		fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_WASM}`, "application/wasm"),
		fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_WORKER}`, "text/javascript")
	]);
	trackBlobUrl(workerUrl);
	trackBlobUrl(coreJsUrl);
	trackBlobUrl(wasmUrl);
	trackBlobUrl(coreWorkerUrl);
	logInfo("ffmpeg", "FFmpeg assets fetched as blobs, loading...");
	try {
		await inst.load({
			classWorkerURL: workerUrl,
			coreURL: coreJsUrl,
			wasmURL: wasmUrl,
			workerURL: coreWorkerUrl
		});
		logInfo("ffmpeg", "FFmpeg loaded successfully");
	} catch (err) {
		logError("ffmpeg", "FFmpeg load failed", err);
		throw err;
	}
	ffmpegInstance = inst;
	return inst;
}
/**
* Merge audio and video using FFmpeg, return the merged data buffer.
*/
async function mergeAudioVideo(baseUrl, audioUrl, videoUrl) {
	logInfo("ffmpeg", "mergeAudioVideo: starting merge");
	const ffmpeg = await getFFmpeg(baseUrl);
	const ts = `${Date.now()}${Math.random()}`;
	const audioFile = `${ts}_audio.mp4`;
	const videoFile = `${ts}_video.mp4`;
	const mergedFile = `${ts}_merged.mp4`;
	logInfo("ffmpeg", `writing audio file (${audioFile})`);
	await ffmpeg.writeFile(audioFile, await toUint8Array(audioUrl));
	logInfo("ffmpeg", `writing video file (${videoFile})`);
	await ffmpeg.writeFile(videoFile, await toUint8Array(videoUrl));
	logInfo("ffmpeg", "executing ffmpeg merge command");
	await ffmpeg.exec([
		"-i",
		videoFile,
		"-i",
		audioFile,
		"-vcodec",
		"copy",
		"-acodec",
		"copy",
		mergedFile
	]);
	logInfo("ffmpeg", `ffmpeg merge complete, reading ${mergedFile}`);
	const data = await ffmpeg.readFile(mergedFile);
	logInfo("ffmpeg", "merge result size", data.byteLength);
	const cleanup = () => {
		ffmpeg.deleteFile(audioFile).catch(() => {});
		ffmpeg.deleteFile(videoFile).catch(() => {});
	};
	usedFiles.add(mergedFile);
	return [data, cleanup];
}
/**
* Cleanup FFmpeg resources on page unload.
*/
function setupCleanup() {
	window.addEventListener("beforeunload", async () => {
		logInfo("ffmpeg", "cleanup on beforeunload");
		await Promise.all([
			...Array.from(usedFiles).map((f) => ffmpegInstance?.deleteFile(f).catch(() => {}) ?? Promise.resolve()),
			...Array.from(blobUrls).map((url) => {
				try {
					URL.revokeObjectURL(url);
				} catch {}
				return Promise.resolve();
			}),
			new Promise((resolve) => {
				try {
					ffmpegInstance?.terminate();
					logInfo("ffmpeg", "FFmpeg instance terminated");
				} catch {}
				resolve();
			})
		]);
	}, true);
}
//#endregion
//#region src/lib/download.ts
var MODULE$4 = "download";
/**
* Download a single stream (advanced mode) with progress.
*/
async function downloadSingle(linkEl, segment, filename, progressEl) {
	linkEl.classList.add("disabled");
	logInfo(MODULE$4, "downloadSingle start", {
		filename,
		size: segment.size
	});
	try {
		const blob = await streamDownload(segment.url, segment.size ?? null, (received, total) => {
			progressEl.innerHTML = ` downloading - ${received}/${total} - ${Math.ceil(received / total * 100)}%`;
		});
		progressEl.innerHTML = " download complete";
		logInfo(MODULE$4, "downloadSingle: stream complete", {
			filename,
			blobSize: blob.size
		});
		let ext = new URL(segment.url).pathname.toLowerCase().match(/\.[a-z0-9]+?$/)?.[0] ?? "";
		if (ext === ".m4s") ext = ".mp4";
		downloadBlob(new Uint8Array(await blob.arrayBuffer()), filename + ext, progressEl.parentElement);
		logInfo(MODULE$4, "downloadSingle: blob download triggered", { filename: filename + ext });
	} catch (err) {
		logError(MODULE$4, "downloadSingle failed", {
			filename,
			url: segment.url
		}, err);
		throw err;
	} finally {
		linkEl.classList.remove("disabled");
	}
}
/**
* Download and merge audio + video (advanced mode with merge on).
*/
async function downloadAndMerge(linkEl, segments, filename, progressEl) {
	linkEl.classList.add("disabled");
	logInfo(MODULE$4, "downloadAndMerge start", {
		filename,
		segmentCount: segments.length
	});
	const downloadResults = await Promise.all(segments.map(async ({ url, size }, i) => {
		const label = i === 0 ? "audio" : "video";
		const subEl = document.createElement("li");
		subEl.innerHTML = `${label} (${formatSize(size)}) downloading`;
		progressEl.appendChild(subEl);
		const blob = await streamDownload(url, size ?? null, (received, total) => {
			const pct = Math.ceil(received / total * 100);
			subEl.innerHTML = `${label} (${formatSize(size)}) downloading - ${received}/${total} - ${pct}%`;
		});
		subEl.innerHTML = `${label} (${formatSize(size ?? blob.size)}) downloaded, awaiting merge`;
		logInfo(MODULE$4, `downloadAndMerge: ${label} downloaded`, { blobSize: blob.size });
		return blob;
	}));
	progressEl.innerHTML = "merging audio+video (time depends on file size)...";
	const { baseUrl } = getInternals();
	logInfo(MODULE$4, "downloadAndMerge: starting ffmpeg merge");
	const [mergedData, cleanup] = await mergeAudioVideo(baseUrl, URL.createObjectURL(downloadResults[0]), URL.createObjectURL(downloadResults[1]));
	progressEl.innerHTML = "done";
	logInfo(MODULE$4, "downloadAndMerge: merge complete", { mergedSize: mergedData.byteLength });
	downloadBlob(new Uint8Array(mergedData), `${filename}.mp4`, progressEl, cleanup);
}
/**
* Normal-mode download: just create a direct download link.
*/
function createNormalDownloadLink(filename, segments, isDash) {
	return segments.map((seg, i) => {
		const label = isDash ? i === 0 ? "音频" : "视频" : `分段${i + 1}`;
		const name = `${filename}_${label}`;
		return `
          <li>
            <a title="${name}" download="${name}.mp4" href="${seg.url}">${label}（请点右键选择链接另存为，直接点击无法下载）</a>
            <span class="size">(${formatSize(seg.size)})</span>
          </li>
        `;
	}).join("");
}
/**
* Advanced mode, no merge: inline download links with click-to-download.
*/
function createAdvancedNoMergeLinks(segments, filename, isDash) {
	return segments.map((seg, i) => {
		const label = isDash ? i === 0 ? "音频" : "视频" : `分段${i + 1}`;
		const name = `${filename}_${label}`;
		const encoded = encodeURIComponent(JSON.stringify(seg));
		return `
          <li>
            <a title="${name}" mode="advanced" merge="off" href="#nogo" durl="${encoded}">${label}</a>
            <span class="size">(${formatSize(seg.size)})</span>
            <span durl="${encoded}" class="progress"></span>
          </li>
        `;
	}).join("");
}
/**
* Advanced mode, merge on: single merge link for dash streams.
*/
function createMergeLink(segments, filename) {
	const total = segments.reduce((sum, s) => sum + (s.size ?? 0), 0);
	const encoded = encodeURIComponent(JSON.stringify(segments));
	return `
      <li>
        <a title="${filename}" durls="${encoded}" mode="advanced" type="a+v" merge="on" href="#nogo">合并下载</a>
        <span class="size">(共${formatSize(total)})</span>
        <ul style="margin-top: 8px;" durls="${encoded}" class="progress"></ul>
      </li>
    `;
}
//#endregion
//#region src/lib/host.ts
var MODULE$3 = "host";
var shadowRoot = null;
var hostElement = null;
function titleHtml(info) {
	if (info.code !== ErrorCode.OK) return `<strong>${info.message ?? "未知错误"}</strong>`;
	const qual = info.quality ? `[${info.quality}] ` : "";
	if (info.dash || info.durl) return `${qual}<strong>${info.title}</strong> 的下载地址：`;
	return `<strong>出错了:( ${info.message ?? "未知错误"}</strong>`;
}
function linksHtml(info) {
	if (info.code !== ErrorCode.OK) return "";
	const isDash = !!info.dash;
	const segments = [];
	if (isDash && info.dash) segments.push({
		url: info.dash.audio.base_url ?? info.dash.audio.baseUrl ?? "",
		size: info.dash.audio.size
	}, {
		url: info.dash.video.base_url ?? info.dash.video.baseUrl ?? "",
		size: info.dash.video.size
	});
	else if (info.durl) segments.push(...info.durl);
	const title = info.title ?? "";
	if (!isAdvancedMode()) return createNormalDownloadLink(title, segments, isDash);
	if (!isMergeMode() || !isDash) return createAdvancedNoMergeLinks(segments, title, isDash);
	return createMergeLink(segments, title);
}
function setupSettings(shadow, buildLinks) {
	const advanced = shadow.getElementById("setting-download-mode-advanced");
	const normal = shadow.getElementById("setting-download-mode-normal");
	const mergeOn = shadow.getElementById("setting-merge-on");
	const mergeOff = shadow.getElementById("setting-merge-off");
	const advancedSettings = shadow.getElementById("setting-advanced");
	const durlsEl = shadow.getElementById("durls");
	const toggle = shadow.getElementById("toggle");
	const content = shadow.getElementById("content");
	const contentHost = document.getElementById(HOST_ELEMENT_ID);
	const actions = shadow.getElementById("actions");
	const disable = () => {
		advanced.disabled = true;
		normal.disabled = true;
		mergeOn.disabled = true;
		mergeOff.disabled = true;
	};
	const enable = () => {
		advanced.disabled = false;
		normal.disabled = false;
		mergeOn.disabled = false;
		mergeOff.disabled = false;
	};
	if (isAdvancedMode()) {
		advanced.checked = true;
		advancedSettings.style.display = "block";
	} else {
		normal.checked = true;
		advancedSettings.style.display = "none";
	}
	if (isMergeMode()) mergeOn.checked = true;
	else mergeOff.checked = true;
	advanced.addEventListener("change", () => {
		logInfo(MODULE$3, "setting changed: download mode -> advanced");
		localStorage.bilibili_helper_download_mode = "advanced";
		advancedSettings.style.display = "block";
		buildLinks();
	});
	normal.addEventListener("change", () => {
		logInfo(MODULE$3, "setting changed: download mode -> normal");
		localStorage.bilibili_helper_download_mode = "normal";
		advancedSettings.style.display = "none";
		buildLinks();
	});
	mergeOn.addEventListener("change", () => {
		logInfo(MODULE$3, "setting changed: merge mode -> on");
		localStorage.bilibili_helper_merge_mode = "on";
		buildLinks();
	});
	mergeOff.addEventListener("change", () => {
		logInfo(MODULE$3, "setting changed: merge mode -> off");
		localStorage.bilibili_helper_merge_mode = "off";
		buildLinks();
	});
	durlsEl.addEventListener("click", (e) => {
		const target = e.target;
		if (target.tagName.toLowerCase() !== "a") return;
		const anchor = target;
		if (anchor.getAttribute("mode") !== "advanced") return;
		if (anchor.classList.contains("disabled")) return;
		e.preventDefault();
		e.stopPropagation();
		const filename = anchor.getAttribute("title") ?? "download";
		if (anchor.getAttribute("merge") === "on") {
			logInfo(MODULE$3, "download click: merge mode", { filename });
			const durlsAttr = anchor.getAttribute("durls");
			if (!durlsAttr) return;
			const progressEl = shadow.querySelector(`ul[durls="${CSS.escape(durlsAttr)}"]`);
			const segments = JSON.parse(decodeURIComponent(durlsAttr));
			disable();
			downloadAndMerge(anchor, segments, filename, progressEl).then(enable).catch((err) => {
				logError(MODULE$3, "downloadAndMerge failed", err);
				enable();
			});
		} else {
			logInfo(MODULE$3, "download click: single mode", { filename });
			const durlAttr = anchor.getAttribute("durl");
			if (!durlAttr) return;
			const progressEl = shadow.querySelector(`span[durl="${CSS.escape(durlAttr)}"]`);
			const segment = JSON.parse(decodeURIComponent(durlAttr));
			disable();
			downloadSingle(anchor, segment, filename, progressEl).then(enable).catch((err) => {
				logError(MODULE$3, "downloadSingle failed", err);
				enable();
			});
		}
	});
	toggle.addEventListener("click", () => {
		if (isHidden()) {
			logInfo(MODULE$3, "toggle: show UI");
			localStorage.bilibili_helper_show = "show";
			content.classList.remove("hide");
			toggle.innerHTML = "收起";
			contentHost?.classList.remove("hide");
			actions.style.top = "0";
			shadow.getElementById("notice-frame")?.contentWindow?.postMessage({ action: "getHeight" }, "https://csser.top");
		} else {
			logInfo(MODULE$3, "toggle: hide UI");
			localStorage.bilibili_helper_show = "hide";
			content.classList.add("hide");
			contentHost?.classList.add("hide");
			toggle.innerHTML = "打开B站下载助手";
			actions.style.top = "0";
		}
	});
	if (contentHost) contentHost.addEventListener("scroll", () => {
		actions.style.top = contentHost.scrollTop + "px";
	});
}
function setupNotice(shadow) {
	const iframe = shadow.getElementById("notice-frame");
	if (!iframe) return;
	iframe.onload = () => {
		logInfo(MODULE$3, "notice iframe loaded");
		iframe.contentWindow?.postMessage({ action: "getHeight" }, "https://csser.top");
		const internals = getInternals();
		iframe.contentWindow?.postMessage({
			action: "setVersion",
			version: {
				name: internals.name,
				code: parseInt(internals.version.replace(/\./g, ""), 10)
			}
		}, "https://csser.top");
		iframe.contentWindow?.postMessage({
			action: "setTheme",
			theme: "null"
		}, "https://csser.top");
	};
	window.addEventListener("message", (e) => {
		if (e.origin !== "https://csser.top" || !e.data) return;
		if (e.data.action === "reportHeight") iframe.style.height = e.data.height + 10 + "px";
	});
	iframe.src = `https://csser.top/bilibili/notice.html?t=${Date.now()}`;
	window.addEventListener("resize", () => {
		iframe.contentWindow?.postMessage({ action: "getHeight" }, "https://csser.top");
	});
}
/**
* Update or create the host UI element with the given download info.
*/
function showDownloadInfo(info, loading = false) {
	logInfo(MODULE$3, "showDownloadInfo", {
		code: info.code,
		title: info.title,
		quality: info.quality,
		hasDash: !!info.dash,
		hasDurl: !!info.durl,
		loading
	});
	const el = document.getElementById(HOST_ELEMENT_ID);
	const hostStyles = `display:block;overflow:auto;position:fixed;z-index:${Number.MAX_SAFE_INTEGER};bottom:0;left:0;right:0;max-height:50%;width:100%;background: #fff;border-top: 1px solid #ccc;box-shadow: rgba(0, 0, 0, 0.2) 0 -5px 10px;`;
	if (el) {
		shadowRoot = el.shadowRoot;
		const titleEl = shadowRoot.getElementById("title");
		titleEl.innerHTML = loading ? "加载中" + LOADING_SPINNER : titleHtml(info);
		const durlsEl = shadowRoot.getElementById("durls");
		durlsEl.innerHTML = loading ? "" : linksHtml(info);
		const styleEl = shadowRoot.getElementById("d-style");
		styleEl.textContent = !info.dash && info.durl ? "#setting-advanced{display:none!important}" : "";
	} else {
		hostElement = document.createElement("div");
		hostElement.id = HOST_ELEMENT_ID;
		hostElement.style.cssText = hostStyles;
		if (isHidden()) hostElement.classList.add("hide");
		document.body.appendChild(hostElement);
		shadowRoot = hostElement.attachShadow({ mode: "open" });
		shadowRoot.innerHTML = `
      <style>${SHADOW_STYLES}
        #${CSS.escape(HOST_ELEMENT_ID)}.hide{
          width:auto!important;
          left:auto!important;
          background:transparent!important;
          border:0 none!important;
          border-radius: 6px 0 0 0;
          box-shadow: rgba(0, 0, 0, 0.2) -5px -5px 10px!important;
        }
        .player-fullscreen-fix #${CSS.escape(HOST_ELEMENT_ID)} {
          z-index: 9!important;
        }
      </style>
      <div id="content" ${isHidden() ? "class=\"hide\"" : ""}>
        <div id="side-bar">
          <div class="notice">
            <iframe id="notice-frame" frameborder="0"></iframe>
          </div>
        </div>
        <div id="main">
          <style id="d-style">${!info.dash && info.durl ? "#setting-advanced{display:none!important}" : ""}</style>
          ${SETTINGS_HTML}
          <h3 id="title">${loading ? "加载中" + LOADING_SPINNER : titleHtml(info)}</h3>
          <ul id="durls">
            ${loading ? "" : linksHtml(info)}
          </ul>
          <div class="beg">
            <p>
              如果这个工具确实帮到了您，烦请给个五星好评，谢谢😊
              <a class="btn" href="${getReviewUrl()}" target="_blank">去评价</a>
            </p>
          </div>
          <div id="bilibliHelperLogs">
            <h4>解析日志：</h4>
          </div>
        </div>
        <div id="actions">
          <button id="toggle" class="btn-large">${isHidden() ? "打开B站下载助手" : "收起"}</button>
        </div>
      </div>
    `;
		setupSettings(shadowRoot, () => {
			const durlsEl = shadowRoot.getElementById("durls");
			durlsEl.innerHTML = linksHtml(info);
		});
		setupNotice(shadowRoot);
	}
}
/**
* Append a log message to the host UI's log panel.
*/
function log(...args) {
	console.log("[bilibili downloader]", "[host]", ...args);
	try {
		const el = document.getElementById(HOST_ELEMENT_ID);
		if (!el) return;
		const logs = el.shadowRoot?.querySelector("#bilibliHelperLogs");
		if (!logs) return;
		const line = args.map((a) => {
			if (typeof a === "object") try {
				return JSON.stringify(a);
			} catch {
				return String(a);
			}
			return String(a);
		}).join(" ");
		logs.innerHTML += `<p>${line}</p>`;
	} catch {}
}
/**
* Clear log panel.
*/
function clearLogs() {
	logInfo(MODULE$3, "logs cleared");
	const el = document.getElementById(HOST_ELEMENT_ID);
	if (!el) return;
	const logs = el.shadowRoot?.querySelector("#bilibliHelperLogs");
	if (logs) logs.innerHTML = "";
}
//#endregion
//#region __vite-browser-external
var require___vite_browser_external = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
}));
/**
* [js-md5]{@link https://github.com/emn178/js-md5}
*
* @namespace md5
* @version 0.8.3
* @author Chen, Yi-Cyuan [emn178@gmail.com]
* @copyright Chen, Yi-Cyuan 2014-2023
* @license MIT
*/
//#endregion
//#region src/lib/wbi.ts
var import_md5 = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		"use strict";
		var INPUT_ERROR = "input is invalid type";
		var FINALIZE_ERROR = "finalize already called";
		var WINDOW = typeof window === "object";
		var root = WINDOW ? window : {};
		if (root.JS_MD5_NO_WINDOW) WINDOW = false;
		var WEB_WORKER = !WINDOW && typeof self === "object";
		var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
		if (NODE_JS) root = global;
		else if (WEB_WORKER) root = self;
		var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === "object" && module.exports;
		var AMD = typeof define === "function" && define.amd;
		var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
		var HEX_CHARS = "0123456789abcdef".split("");
		var EXTRA = [
			128,
			32768,
			8388608,
			-2147483648
		];
		var SHIFT = [
			0,
			8,
			16,
			24
		];
		var OUTPUT_TYPES = [
			"hex",
			"array",
			"digest",
			"buffer",
			"arrayBuffer",
			"base64"
		];
		var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
		var blocks = [], buffer8;
		if (ARRAY_BUFFER) {
			var buffer = /* @__PURE__ */ new ArrayBuffer(68);
			buffer8 = new Uint8Array(buffer);
			blocks = new Uint32Array(buffer);
		}
		var isArray = Array.isArray;
		if (root.JS_MD5_NO_NODE_JS || !isArray) isArray = function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
		var isView = ArrayBuffer.isView;
		if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) isView = function(obj) {
			return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
		};
		var formatMessage = function(message) {
			var type = typeof message;
			if (type === "string") return [message, true];
			if (type !== "object" || message === null) throw new Error(INPUT_ERROR);
			if (ARRAY_BUFFER && message.constructor === ArrayBuffer) return [new Uint8Array(message), false];
			if (!isArray(message) && !isView(message)) throw new Error(INPUT_ERROR);
			return [message, false];
		};
		/**
		* @method hex
		* @memberof md5
		* @description Output hash as hex string
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {String} Hex string
		* @example
		* md5.hex('The quick brown fox jumps over the lazy dog');
		* // equal to
		* md5('The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method digest
		* @memberof md5
		* @description Output hash as bytes array
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {Array} Bytes array
		* @example
		* md5.digest('The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method array
		* @memberof md5
		* @description Output hash as bytes array
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {Array} Bytes array
		* @example
		* md5.array('The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method arrayBuffer
		* @memberof md5
		* @description Output hash as ArrayBuffer
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {ArrayBuffer} ArrayBuffer
		* @example
		* md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method buffer
		* @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
		* @memberof md5
		* @description Output hash as ArrayBuffer
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {ArrayBuffer} ArrayBuffer
		* @example
		* md5.buffer('The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method base64
		* @memberof md5
		* @description Output hash as base64 string
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {String} base64 string
		* @example
		* md5.base64('The quick brown fox jumps over the lazy dog');
		*/
		var createOutputMethod = function(outputType) {
			return function(message) {
				return new Md5(true).update(message)[outputType]();
			};
		};
		/**
		* @method create
		* @memberof md5
		* @description Create Md5 object
		* @returns {Md5} Md5 object.
		* @example
		* var hash = md5.create();
		*/
		/**
		* @method update
		* @memberof md5
		* @description Create and update Md5 object
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {Md5} Md5 object.
		* @example
		* var hash = md5.update('The quick brown fox jumps over the lazy dog');
		* // equal to
		* var hash = md5.create();
		* hash.update('The quick brown fox jumps over the lazy dog');
		*/
		var createMethod = function() {
			var method = createOutputMethod("hex");
			if (NODE_JS) method = nodeWrap(method);
			method.create = function() {
				return new Md5();
			};
			method.update = function(message) {
				return method.create().update(message);
			};
			for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
				var type = OUTPUT_TYPES[i];
				method[type] = createOutputMethod(type);
			}
			return method;
		};
		var nodeWrap = function(method) {
			var crypto = require___vite_browser_external();
			var Buffer = require___vite_browser_external().Buffer;
			var bufferFrom;
			if (Buffer.from && !root.JS_MD5_NO_BUFFER_FROM) bufferFrom = Buffer.from;
			else bufferFrom = function(message) {
				return new Buffer(message);
			};
			var nodeMethod = function(message) {
				if (typeof message === "string") return crypto.createHash("md5").update(message, "utf8").digest("hex");
				else if (message === null || message === void 0) throw new Error(INPUT_ERROR);
				else if (message.constructor === ArrayBuffer) message = new Uint8Array(message);
				if (isArray(message) || isView(message) || message.constructor === Buffer) return crypto.createHash("md5").update(bufferFrom(message)).digest("hex");
				else return method(message);
			};
			return nodeMethod;
		};
		/**
		* @namespace md5.hmac
		*/
		/**
		* @method hex
		* @memberof md5.hmac
		* @description Output hash as hex string
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {String} Hex string
		* @example
		* md5.hmac.hex('key', 'The quick brown fox jumps over the lazy dog');
		* // equal to
		* md5.hmac('key', 'The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method digest
		* @memberof md5.hmac
		* @description Output hash as bytes array
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {Array} Bytes array
		* @example
		* md5.hmac.digest('key', 'The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method array
		* @memberof md5.hmac
		* @description Output hash as bytes array
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {Array} Bytes array
		* @example
		* md5.hmac.array('key', 'The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method arrayBuffer
		* @memberof md5.hmac
		* @description Output hash as ArrayBuffer
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {ArrayBuffer} ArrayBuffer
		* @example
		* md5.hmac.arrayBuffer('key', 'The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method buffer
		* @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
		* @memberof md5.hmac
		* @description Output hash as ArrayBuffer
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {ArrayBuffer} ArrayBuffer
		* @example
		* md5.hmac.buffer('key', 'The quick brown fox jumps over the lazy dog');
		*/
		/**
		* @method base64
		* @memberof md5.hmac
		* @description Output hash as base64 string
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {String} base64 string
		* @example
		* md5.hmac.base64('key', 'The quick brown fox jumps over the lazy dog');
		*/
		var createHmacOutputMethod = function(outputType) {
			return function(key, message) {
				return new HmacMd5(key, true).update(message)[outputType]();
			};
		};
		/**
		* @method create
		* @memberof md5.hmac
		* @description Create HmacMd5 object
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @returns {HmacMd5} HmacMd5 object.
		* @example
		* var hash = md5.hmac.create('key');
		*/
		/**
		* @method update
		* @memberof md5.hmac
		* @description Create and update HmacMd5 object
		* @param {String|Array|Uint8Array|ArrayBuffer} key key
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {HmacMd5} HmacMd5 object.
		* @example
		* var hash = md5.hmac.update('key', 'The quick brown fox jumps over the lazy dog');
		* // equal to
		* var hash = md5.hmac.create('key');
		* hash.update('The quick brown fox jumps over the lazy dog');
		*/
		var createHmacMethod = function() {
			var method = createHmacOutputMethod("hex");
			method.create = function(key) {
				return new HmacMd5(key);
			};
			method.update = function(key, message) {
				return method.create(key).update(message);
			};
			for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
				var type = OUTPUT_TYPES[i];
				method[type] = createHmacOutputMethod(type);
			}
			return method;
		};
		/**
		* Md5 class
		* @class Md5
		* @description This is internal class.
		* @see {@link md5.create}
		*/
		function Md5(sharedMemory) {
			if (sharedMemory) {
				blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
				this.blocks = blocks;
				this.buffer8 = buffer8;
			} else if (ARRAY_BUFFER) {
				var buffer = /* @__PURE__ */ new ArrayBuffer(68);
				this.buffer8 = new Uint8Array(buffer);
				this.blocks = new Uint32Array(buffer);
			} else this.blocks = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
			this.finalized = this.hashed = false;
			this.first = true;
		}
		/**
		* @method update
		* @memberof Md5
		* @instance
		* @description Update hash
		* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
		* @returns {Md5} Md5 object.
		* @see {@link md5.update}
		*/
		Md5.prototype.update = function(message) {
			if (this.finalized) throw new Error(FINALIZE_ERROR);
			var result = formatMessage(message);
			message = result[0];
			var isString = result[1];
			var code, index = 0, i, length = message.length, blocks = this.blocks;
			var buffer8 = this.buffer8;
			while (index < length) {
				if (this.hashed) {
					this.hashed = false;
					blocks[0] = blocks[16];
					blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
				}
				if (isString) if (ARRAY_BUFFER) for (i = this.start; index < length && i < 64; ++index) {
					code = message.charCodeAt(index);
					if (code < 128) buffer8[i++] = code;
					else if (code < 2048) {
						buffer8[i++] = 192 | code >>> 6;
						buffer8[i++] = 128 | code & 63;
					} else if (code < 55296 || code >= 57344) {
						buffer8[i++] = 224 | code >>> 12;
						buffer8[i++] = 128 | code >>> 6 & 63;
						buffer8[i++] = 128 | code & 63;
					} else {
						code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
						buffer8[i++] = 240 | code >>> 18;
						buffer8[i++] = 128 | code >>> 12 & 63;
						buffer8[i++] = 128 | code >>> 6 & 63;
						buffer8[i++] = 128 | code & 63;
					}
				}
				else for (i = this.start; index < length && i < 64; ++index) {
					code = message.charCodeAt(index);
					if (code < 128) blocks[i >>> 2] |= code << SHIFT[i++ & 3];
					else if (code < 2048) {
						blocks[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else if (code < 55296 || code >= 57344) {
						blocks[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else {
						code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
						blocks[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					}
				}
				else if (ARRAY_BUFFER) for (i = this.start; index < length && i < 64; ++index) buffer8[i++] = message[index];
				else for (i = this.start; index < length && i < 64; ++index) blocks[i >>> 2] |= message[index] << SHIFT[i++ & 3];
				this.lastByteIndex = i;
				this.bytes += i - this.start;
				if (i >= 64) {
					this.start = i - 64;
					this.hash();
					this.hashed = true;
				} else this.start = i;
			}
			if (this.bytes > 4294967295) {
				this.hBytes += this.bytes / 4294967296 << 0;
				this.bytes = this.bytes % 4294967296;
			}
			return this;
		};
		Md5.prototype.finalize = function() {
			if (this.finalized) return;
			this.finalized = true;
			var blocks = this.blocks, i = this.lastByteIndex;
			blocks[i >>> 2] |= EXTRA[i & 3];
			if (i >= 56) {
				if (!this.hashed) this.hash();
				blocks[0] = blocks[16];
				blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
			}
			blocks[14] = this.bytes << 3;
			blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
			this.hash();
		};
		Md5.prototype.hash = function() {
			var a, b, c, d, bc, da, blocks = this.blocks;
			if (this.first) {
				a = blocks[0] - 680876937;
				a = (a << 7 | a >>> 25) - 271733879 << 0;
				d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
				d = (d << 12 | d >>> 20) + a << 0;
				c = (-271733879 ^ d & (a ^ -271733879)) + blocks[2] - 1126478375;
				c = (c << 17 | c >>> 15) + d << 0;
				b = (a ^ c & (d ^ a)) + blocks[3] - 1316259209;
				b = (b << 22 | b >>> 10) + c << 0;
			} else {
				a = this.h0;
				b = this.h1;
				c = this.h2;
				d = this.h3;
				a += (d ^ b & (c ^ d)) + blocks[0] - 680876936;
				a = (a << 7 | a >>> 25) + b << 0;
				d += (c ^ a & (b ^ c)) + blocks[1] - 389564586;
				d = (d << 12 | d >>> 20) + a << 0;
				c += (b ^ d & (a ^ b)) + blocks[2] + 606105819;
				c = (c << 17 | c >>> 15) + d << 0;
				b += (a ^ c & (d ^ a)) + blocks[3] - 1044525330;
				b = (b << 22 | b >>> 10) + c << 0;
			}
			a += (d ^ b & (c ^ d)) + blocks[4] - 176418897;
			a = (a << 7 | a >>> 25) + b << 0;
			d += (c ^ a & (b ^ c)) + blocks[5] + 1200080426;
			d = (d << 12 | d >>> 20) + a << 0;
			c += (b ^ d & (a ^ b)) + blocks[6] - 1473231341;
			c = (c << 17 | c >>> 15) + d << 0;
			b += (a ^ c & (d ^ a)) + blocks[7] - 45705983;
			b = (b << 22 | b >>> 10) + c << 0;
			a += (d ^ b & (c ^ d)) + blocks[8] + 1770035416;
			a = (a << 7 | a >>> 25) + b << 0;
			d += (c ^ a & (b ^ c)) + blocks[9] - 1958414417;
			d = (d << 12 | d >>> 20) + a << 0;
			c += (b ^ d & (a ^ b)) + blocks[10] - 42063;
			c = (c << 17 | c >>> 15) + d << 0;
			b += (a ^ c & (d ^ a)) + blocks[11] - 1990404162;
			b = (b << 22 | b >>> 10) + c << 0;
			a += (d ^ b & (c ^ d)) + blocks[12] + 1804603682;
			a = (a << 7 | a >>> 25) + b << 0;
			d += (c ^ a & (b ^ c)) + blocks[13] - 40341101;
			d = (d << 12 | d >>> 20) + a << 0;
			c += (b ^ d & (a ^ b)) + blocks[14] - 1502002290;
			c = (c << 17 | c >>> 15) + d << 0;
			b += (a ^ c & (d ^ a)) + blocks[15] + 1236535329;
			b = (b << 22 | b >>> 10) + c << 0;
			a += (c ^ d & (b ^ c)) + blocks[1] - 165796510;
			a = (a << 5 | a >>> 27) + b << 0;
			d += (b ^ c & (a ^ b)) + blocks[6] - 1069501632;
			d = (d << 9 | d >>> 23) + a << 0;
			c += (a ^ b & (d ^ a)) + blocks[11] + 643717713;
			c = (c << 14 | c >>> 18) + d << 0;
			b += (d ^ a & (c ^ d)) + blocks[0] - 373897302;
			b = (b << 20 | b >>> 12) + c << 0;
			a += (c ^ d & (b ^ c)) + blocks[5] - 701558691;
			a = (a << 5 | a >>> 27) + b << 0;
			d += (b ^ c & (a ^ b)) + blocks[10] + 38016083;
			d = (d << 9 | d >>> 23) + a << 0;
			c += (a ^ b & (d ^ a)) + blocks[15] - 660478335;
			c = (c << 14 | c >>> 18) + d << 0;
			b += (d ^ a & (c ^ d)) + blocks[4] - 405537848;
			b = (b << 20 | b >>> 12) + c << 0;
			a += (c ^ d & (b ^ c)) + blocks[9] + 568446438;
			a = (a << 5 | a >>> 27) + b << 0;
			d += (b ^ c & (a ^ b)) + blocks[14] - 1019803690;
			d = (d << 9 | d >>> 23) + a << 0;
			c += (a ^ b & (d ^ a)) + blocks[3] - 187363961;
			c = (c << 14 | c >>> 18) + d << 0;
			b += (d ^ a & (c ^ d)) + blocks[8] + 1163531501;
			b = (b << 20 | b >>> 12) + c << 0;
			a += (c ^ d & (b ^ c)) + blocks[13] - 1444681467;
			a = (a << 5 | a >>> 27) + b << 0;
			d += (b ^ c & (a ^ b)) + blocks[2] - 51403784;
			d = (d << 9 | d >>> 23) + a << 0;
			c += (a ^ b & (d ^ a)) + blocks[7] + 1735328473;
			c = (c << 14 | c >>> 18) + d << 0;
			b += (d ^ a & (c ^ d)) + blocks[12] - 1926607734;
			b = (b << 20 | b >>> 12) + c << 0;
			bc = b ^ c;
			a += (bc ^ d) + blocks[5] - 378558;
			a = (a << 4 | a >>> 28) + b << 0;
			d += (bc ^ a) + blocks[8] - 2022574463;
			d = (d << 11 | d >>> 21) + a << 0;
			da = d ^ a;
			c += (da ^ b) + blocks[11] + 1839030562;
			c = (c << 16 | c >>> 16) + d << 0;
			b += (da ^ c) + blocks[14] - 35309556;
			b = (b << 23 | b >>> 9) + c << 0;
			bc = b ^ c;
			a += (bc ^ d) + blocks[1] - 1530992060;
			a = (a << 4 | a >>> 28) + b << 0;
			d += (bc ^ a) + blocks[4] + 1272893353;
			d = (d << 11 | d >>> 21) + a << 0;
			da = d ^ a;
			c += (da ^ b) + blocks[7] - 155497632;
			c = (c << 16 | c >>> 16) + d << 0;
			b += (da ^ c) + blocks[10] - 1094730640;
			b = (b << 23 | b >>> 9) + c << 0;
			bc = b ^ c;
			a += (bc ^ d) + blocks[13] + 681279174;
			a = (a << 4 | a >>> 28) + b << 0;
			d += (bc ^ a) + blocks[0] - 358537222;
			d = (d << 11 | d >>> 21) + a << 0;
			da = d ^ a;
			c += (da ^ b) + blocks[3] - 722521979;
			c = (c << 16 | c >>> 16) + d << 0;
			b += (da ^ c) + blocks[6] + 76029189;
			b = (b << 23 | b >>> 9) + c << 0;
			bc = b ^ c;
			a += (bc ^ d) + blocks[9] - 640364487;
			a = (a << 4 | a >>> 28) + b << 0;
			d += (bc ^ a) + blocks[12] - 421815835;
			d = (d << 11 | d >>> 21) + a << 0;
			da = d ^ a;
			c += (da ^ b) + blocks[15] + 530742520;
			c = (c << 16 | c >>> 16) + d << 0;
			b += (da ^ c) + blocks[2] - 995338651;
			b = (b << 23 | b >>> 9) + c << 0;
			a += (c ^ (b | ~d)) + blocks[0] - 198630844;
			a = (a << 6 | a >>> 26) + b << 0;
			d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
			d = (d << 10 | d >>> 22) + a << 0;
			c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
			c = (c << 15 | c >>> 17) + d << 0;
			b += (d ^ (c | ~a)) + blocks[5] - 57434055;
			b = (b << 21 | b >>> 11) + c << 0;
			a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
			a = (a << 6 | a >>> 26) + b << 0;
			d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
			d = (d << 10 | d >>> 22) + a << 0;
			c += (a ^ (d | ~b)) + blocks[10] - 1051523;
			c = (c << 15 | c >>> 17) + d << 0;
			b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
			b = (b << 21 | b >>> 11) + c << 0;
			a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
			a = (a << 6 | a >>> 26) + b << 0;
			d += (b ^ (a | ~c)) + blocks[15] - 30611744;
			d = (d << 10 | d >>> 22) + a << 0;
			c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
			c = (c << 15 | c >>> 17) + d << 0;
			b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
			b = (b << 21 | b >>> 11) + c << 0;
			a += (c ^ (b | ~d)) + blocks[4] - 145523070;
			a = (a << 6 | a >>> 26) + b << 0;
			d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
			d = (d << 10 | d >>> 22) + a << 0;
			c += (a ^ (d | ~b)) + blocks[2] + 718787259;
			c = (c << 15 | c >>> 17) + d << 0;
			b += (d ^ (c | ~a)) + blocks[9] - 343485551;
			b = (b << 21 | b >>> 11) + c << 0;
			if (this.first) {
				this.h0 = a + 1732584193 << 0;
				this.h1 = b - 271733879 << 0;
				this.h2 = c - 1732584194 << 0;
				this.h3 = d + 271733878 << 0;
				this.first = false;
			} else {
				this.h0 = this.h0 + a << 0;
				this.h1 = this.h1 + b << 0;
				this.h2 = this.h2 + c << 0;
				this.h3 = this.h3 + d << 0;
			}
		};
		/**
		* @method hex
		* @memberof Md5
		* @instance
		* @description Output hash as hex string
		* @returns {String} Hex string
		* @see {@link md5.hex}
		* @example
		* hash.hex();
		*/
		Md5.prototype.hex = function() {
			this.finalize();
			var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
			return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
		};
		/**
		* @method toString
		* @memberof Md5
		* @instance
		* @description Output hash as hex string
		* @returns {String} Hex string
		* @see {@link md5.hex}
		* @example
		* hash.toString();
		*/
		Md5.prototype.toString = Md5.prototype.hex;
		/**
		* @method digest
		* @memberof Md5
		* @instance
		* @description Output hash as bytes array
		* @returns {Array} Bytes array
		* @see {@link md5.digest}
		* @example
		* hash.digest();
		*/
		Md5.prototype.digest = function() {
			this.finalize();
			var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
			return [
				h0 & 255,
				h0 >>> 8 & 255,
				h0 >>> 16 & 255,
				h0 >>> 24 & 255,
				h1 & 255,
				h1 >>> 8 & 255,
				h1 >>> 16 & 255,
				h1 >>> 24 & 255,
				h2 & 255,
				h2 >>> 8 & 255,
				h2 >>> 16 & 255,
				h2 >>> 24 & 255,
				h3 & 255,
				h3 >>> 8 & 255,
				h3 >>> 16 & 255,
				h3 >>> 24 & 255
			];
		};
		/**
		* @method array
		* @memberof Md5
		* @instance
		* @description Output hash as bytes array
		* @returns {Array} Bytes array
		* @see {@link md5.array}
		* @example
		* hash.array();
		*/
		Md5.prototype.array = Md5.prototype.digest;
		/**
		* @method arrayBuffer
		* @memberof Md5
		* @instance
		* @description Output hash as ArrayBuffer
		* @returns {ArrayBuffer} ArrayBuffer
		* @see {@link md5.arrayBuffer}
		* @example
		* hash.arrayBuffer();
		*/
		Md5.prototype.arrayBuffer = function() {
			this.finalize();
			var buffer = /* @__PURE__ */ new ArrayBuffer(16);
			var blocks = new Uint32Array(buffer);
			blocks[0] = this.h0;
			blocks[1] = this.h1;
			blocks[2] = this.h2;
			blocks[3] = this.h3;
			return buffer;
		};
		/**
		* @method buffer
		* @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
		* @memberof Md5
		* @instance
		* @description Output hash as ArrayBuffer
		* @returns {ArrayBuffer} ArrayBuffer
		* @see {@link md5.buffer}
		* @example
		* hash.buffer();
		*/
		Md5.prototype.buffer = Md5.prototype.arrayBuffer;
		/**
		* @method base64
		* @memberof Md5
		* @instance
		* @description Output hash as base64 string
		* @returns {String} base64 string
		* @see {@link md5.base64}
		* @example
		* hash.base64();
		*/
		Md5.prototype.base64 = function() {
			var v1, v2, v3, base64Str = "", bytes = this.array();
			for (var i = 0; i < 15;) {
				v1 = bytes[i++];
				v2 = bytes[i++];
				v3 = bytes[i++];
				base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
			}
			v1 = bytes[i];
			base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
			return base64Str;
		};
		/**
		* HmacMd5 class
		* @class HmacMd5
		* @extends Md5
		* @description This is internal class.
		* @see {@link md5.hmac.create}
		*/
		function HmacMd5(key, sharedMemory) {
			var i, result = formatMessage(key);
			key = result[0];
			if (result[1]) {
				var bytes = [], length = key.length, index = 0, code;
				for (i = 0; i < length; ++i) {
					code = key.charCodeAt(i);
					if (code < 128) bytes[index++] = code;
					else if (code < 2048) {
						bytes[index++] = 192 | code >>> 6;
						bytes[index++] = 128 | code & 63;
					} else if (code < 55296 || code >= 57344) {
						bytes[index++] = 224 | code >>> 12;
						bytes[index++] = 128 | code >>> 6 & 63;
						bytes[index++] = 128 | code & 63;
					} else {
						code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
						bytes[index++] = 240 | code >>> 18;
						bytes[index++] = 128 | code >>> 12 & 63;
						bytes[index++] = 128 | code >>> 6 & 63;
						bytes[index++] = 128 | code & 63;
					}
				}
				key = bytes;
			}
			if (key.length > 64) key = new Md5(true).update(key).array();
			var oKeyPad = [], iKeyPad = [];
			for (i = 0; i < 64; ++i) {
				var b = key[i] || 0;
				oKeyPad[i] = 92 ^ b;
				iKeyPad[i] = 54 ^ b;
			}
			Md5.call(this, sharedMemory);
			this.update(iKeyPad);
			this.oKeyPad = oKeyPad;
			this.inner = true;
			this.sharedMemory = sharedMemory;
		}
		HmacMd5.prototype = new Md5();
		HmacMd5.prototype.finalize = function() {
			Md5.prototype.finalize.call(this);
			if (this.inner) {
				this.inner = false;
				var innerHash = this.array();
				Md5.call(this, this.sharedMemory);
				this.update(this.oKeyPad);
				this.update(innerHash);
				Md5.prototype.finalize.call(this);
			}
		};
		var exports$1 = createMethod();
		exports$1.md5 = exports$1;
		exports$1.md5.hmac = createHmacMethod();
		if (COMMON_JS) module.exports = exports$1;
		else {
			/**
			* @method md5
			* @description Md5 hash function, export to global in browsers.
			* @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
			* @returns {String} md5 hashes
			* @example
			* md5(''); // d41d8cd98f00b204e9800998ecf8427e
			* md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
			* md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
			*
			* // It also supports UTF-8 encoding
			* md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
			*
			* // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
			* md5([]); // d41d8cd98f00b204e9800998ecf8427e
			* md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
			*/
			root.md5 = exports$1;
			if (AMD) define(function() {
				return exports$1;
			});
		}
	})();
})))();
var MODULE$2 = "wbi";
/**
* WBI signing for Bilibili API requests.
* Required on endpoints like /x/player/wbi/playurl.
* Algorithm from SocialSisterYi/bilibili-API-collect (maintained fork: melon-444).
*/
var MIXIN_KEY_ENC_TAB = [
	46,
	47,
	18,
	2,
	53,
	8,
	23,
	32,
	15,
	50,
	10,
	31,
	58,
	3,
	45,
	35,
	27,
	43,
	5,
	49,
	33,
	9,
	42,
	19,
	29,
	28,
	14,
	39,
	12,
	38,
	41,
	13,
	37,
	48,
	7,
	16,
	24,
	55,
	40,
	61,
	26,
	17,
	0,
	1,
	60,
	51,
	30,
	4,
	22,
	25,
	54,
	21,
	56,
	59,
	6,
	63,
	57,
	62,
	11,
	36,
	20,
	34,
	44,
	52
];
var KEY_TTL_MS = 3600 * 1e3;
var cachedKeys = null;
/** Derive the 32-char mixin key from img_key + sub_key using the fixed shuffle table. */
function getMixinKey(imgKey, subKey) {
	const raw = imgKey + subKey;
	let out = "";
	for (const idx of MIXIN_KEY_ENC_TAB) out += raw[idx] ?? "";
	return out.slice(0, 32);
}
/**
* URL-encode a value the way Bilibili's frontend does: percent-encoded hex is
* uppercase, spaces become %20 (not +), and the characters !'()* are stripped
* before encoding.
*/
function encodeWbiValue(value) {
	const stripped = value.replace(/[!'()*]/g, "");
	return encodeURIComponent(stripped).replace(/%[0-9a-f]{2}/g, (m) => m.toUpperCase()).replace(/%20/g, "%20");
}
/**
* Compute the WBI signature for a set of params.
* Returns a new params object with `wts` and `w_rid` added.
*/
function encWbi(params, imgKey, subKey) {
	const mixinKey = getMixinKey(imgKey, subKey);
	const wts = Math.floor(Date.now() / 1e3).toString();
	const withWts = {
		...params,
		wts
	};
	const wRid = (0, import_md5.md5)(Object.keys(withWts).sort().map((k) => `${encodeURIComponent(k)}=${encodeWbiValue(withWts[k])}`).join("&") + mixinKey);
	return {
		...withWts,
		w_rid: wRid
	};
}
/** Extract img_key and sub_key filenames (without extension) from the nav API response. */
function extractKeysFromNav(navData) {
	const img = navData?.wbi_img?.img_url;
	const sub = navData?.wbi_img?.sub_url;
	if (!img || !sub) return null;
	const imgKey = img.split("/").pop()?.split(".")[0] ?? "";
	const subKey = sub.split("/").pop()?.split(".")[0] ?? "";
	if (!imgKey || !subKey) return null;
	return {
		imgKey,
		subKey
	};
}
/** Fetch and cache the WBI keys from the nav API. */
async function fetchWbiKeys(force = false) {
	if (!force && cachedKeys && Date.now() - cachedKeys.fetchedAt < KEY_TTL_MS) {
		logInfo(MODULE$2, "using cached WBI keys", { age: Date.now() - cachedKeys.fetchedAt });
		return {
			imgKey: cachedKeys.imgKey,
			subKey: cachedKeys.subKey
		};
	}
	logInfo(MODULE$2, "fetching WBI keys from nav API", {
		force,
		reason: force ? "forced" : "cache miss/expired"
	});
	const json = await (await window.fetch(NAV_API, FETCH_DEFAULTS)).json();
	if (json.code !== 0) {
		logError(MODULE$2, "nav API returned non-zero code", json.code);
		throw new Error(`nav API returned code ${json.code}`);
	}
	const keys = extractKeysFromNav(json.data ?? {});
	if (!keys) {
		logError(MODULE$2, "failed to extract WBI keys from nav response", json.data);
		throw new Error("failed to extract WBI keys from nav response");
	}
	cachedKeys = {
		...keys,
		fetchedAt: Date.now()
	};
	logInfo(MODULE$2, "WBI keys fetched and cached", {
		imgKey: keys.imgKey.slice(0, 8) + "...",
		subKey: keys.subKey.slice(0, 8) + "..."
	});
	return keys;
}
/** Clear the cached WBI keys (used when a signed request fails). */
function clearWbiKeys() {
	logInfo(MODULE$2, "WBI key cache cleared");
	cachedKeys = null;
}
/**
* Convenience: sign a params object using the current (cached) WBI keys.
* Fetches keys if not cached.
*/
async function signWbi(params) {
	const { imgKey, subKey } = await fetchWbiKeys();
	const signed = encWbi(params, imgKey, subKey);
	logInfo(MODULE$2, "signWbi: params signed", {
		paramCount: Object.keys(signed).length,
		hasWRid: !!signed.w_rid,
		hasWts: !!signed.wts
	});
	return signed;
}
//#endregion
//#region src/lib/bilibili-types.ts
/**
* Zod schemas for the __INITIAL_STATE__ data embedded in Bilibili pages.
*/
var SeasonEpisodeSchema = object({
	ep_id: number(),
	title: string().optional(),
	titleFormat: string().optional(),
	long_title: string().optional(),
	share_copy: string().optional()
});
object({ mediaInfo: object({
	title: string(),
	episodes: array(SeasonEpisodeSchema)
}) });
object({ supplement: object({ ogv_episode_info: object({
	episode_id: number(),
	index_title: string(),
	long_title: string()
}) }) });
object({ result: object({
	video_info: object({
		dash: any().optional(),
		durl: any().optional(),
		avid: number().optional(),
		cid: number().optional()
	}),
	arc: object({
		aid: number(),
		cid: number()
	})
}) });
//#endregion
//#region src/lib/bilibili-api.ts
var MODULE$1 = "api";
/** Normalize a dash stream's URL/backup fields to the snake_case form regardless of API casing. */
function normalizeStream(stream) {
	return {
		...stream,
		base_url: stream.base_url ?? stream.baseUrl ?? "",
		backup_url: stream.backup_url ?? stream.backupUrl
	};
}
function buildDashResult(dash, quality, codecid) {
	const video = dash.video.find((v) => `${v.codecid ?? ""}` === `${codecid}` && `${v.id}` === `${quality}`) ?? dash.video[0];
	const audio = dash.audio[0];
	if (!audio || !video) {
		logWarn(MODULE$1, "buildDashResult: no matching audio/video", {
			quality,
			codecid,
			audioCount: dash.audio.length,
			videoCount: dash.video.length,
			videoIds: dash.video.map((v) => v.id)
		});
		return {
			code: ErrorCode.INVALID_RESPONSE,
			message: "该视频暂时不支持下载"
		};
	}
	logInfo(MODULE$1, "buildDashResult: matched", {
		videoId: video.id,
		videoCodecid: video.codecid,
		audioId: audio.id,
		qualityLabel: QUALITY_LABELS[video.id] ?? ""
	});
	return {
		code: ErrorCode.OK,
		dash: {
			audio: normalizeStream(audio),
			video: normalizeStream(video)
		},
		qualityDescription: QUALITY_LABELS[video.id] ?? ""
	};
}
function buildDurlResult(durl) {
	logInfo(MODULE$1, "buildDurlResult: segments", durl.length);
	return {
		code: ErrorCode.OK,
		durl,
		qualityDescription: ""
	};
}
/** True if the user is not logged in (no SESSDATA cookie). */
function isLoggedOut() {
	return !document.cookie.includes("SESSDATA");
}
/** Apply quality-label updates from an API response into the shared QUALITY_LABELS map. */
function updateQualityLabels(data) {
	if (data.accept_quality && data.accept_description) data.accept_quality.forEach((q, i) => {
		QUALITY_LABELS[q] = data.accept_description[i] ?? QUALITY_LABELS[q];
	});
	if (data.support_formats) for (const fmt of data.support_formats) QUALITY_LABELS[fmt.quality] = fmt.new_description || fmt.display_desc || QUALITY_LABELS[fmt.quality];
}
/** Parse a UGC playurl JSON response into a PlayUrlResult. */
function parseUgcResponse(json, quality) {
	if (json.code !== ErrorCode.OK) {
		logWarn(MODULE$1, "UGC API returned error code", json.code, json.message);
		if (json.code === ErrorCode.VIP_ONLY) return {
			code: ErrorCode.VIP_ONLY,
			message: "该视频只能登陆大会员账号之后下载，如登录后仍然报错，可以尝试清除浏览器cookies和缓存后重试"
		};
		return {
			code: json.code,
			message: json.message ?? "未知错误"
		};
	}
	const data = json.data;
	updateQualityLabels(data);
	if (data.dash) return buildDashResult(data.dash, quality, data.video_codecid ?? 0);
	if (data.durl) return buildDurlResult(data.durl);
	return {
		code: ErrorCode.UNKNOWN,
		message: "未知错误"
	};
}
/**
* Fetch play URL info for a UGC (normal) video, with WBI signing.
* Retries once with fresh WBI keys on risk-control errors.
*/
async function fetchUgcPlayUrl(avid, bvid, cid, quality = 120) {
	const params = {
		qn: String(quality),
		fnver: "0",
		fnval: "4048",
		fourk: "1",
		otype: "json",
		cid: String(cid)
	};
	if (avid) params.avid = String(avid);
	if (bvid) params.bvid = bvid;
	if (isLoggedOut()) params.try_look = "1";
	logInfo(MODULE$1, "fetchUgcPlayUrl", {
		avid,
		bvid,
		cid,
		quality,
		loggedOut: isLoggedOut()
	});
	const attempt = async (forceRefresh) => {
		if (forceRefresh) {
			logWarn(MODULE$1, "WBI key refresh triggered by risk-control error");
			clearWbiKeys();
		}
		const signed = await signWbi(params);
		const url = `${UGC_PLAY_URL_API}?${new URLSearchParams(signed).toString()}`;
		const done = logFetch(MODULE$1, url, "GET");
		let response;
		try {
			response = await window.fetch(url, FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			logError(MODULE$1, "fetchUgcPlayUrl network error", err);
			return {
				code: ErrorCode.FAILED_TO_FETCH,
				message: "网络请求失败"
			};
		}
		done(response);
		const json = await response.json();
		if (json.code === -509 || json.code === -403 || json.code === -352) {
			logWarn(MODULE$1, "risk-control error", json.code, json.message, "retrying with fresh WBI keys");
			if (!forceRefresh) return attempt(true);
		}
		return parseUgcResponse(json, quality);
	};
	return attempt(false);
}
/**
* Fetch play URL info for a bangumi (番剧/PGC) episode via the v2 endpoint.
* No WBI signing required for the v2 PGC endpoint, only login cookies.
*/
async function fetchBangumiPlayUrl(epId, cid, quality = 120) {
	logInfo(MODULE$1, "fetchBangumiPlayUrl", {
		epId,
		cid,
		quality,
		loggedOut: isLoggedOut()
	});
	const params = new URLSearchParams({
		qn: String(quality),
		fnver: "0",
		fnval: "4048",
		fourk: "1",
		otype: "json",
		cid: String(cid),
		ep_id: String(epId),
		module: "bangumi",
		session: "",
		from_client: "BROWSER",
		support_multi_audio: "true"
	});
	if (isLoggedOut()) params.set("try_look", "1");
	const url = `${BANGUMI_PLAY_URL_API}?${params.toString()}`;
	const done = logFetch(MODULE$1, url, "GET");
	let response;
	try {
		response = await window.fetch(url, FETCH_DEFAULTS);
	} catch (err) {
		done(null);
		logError(MODULE$1, "fetchBangumiPlayUrl network error", err);
		return {
			code: ErrorCode.FAILED_TO_FETCH,
			message: "网络请求失败"
		};
	}
	done(response);
	const json = await response.json();
	if (json.code !== ErrorCode.OK) {
		logWarn(MODULE$1, "bangumi API error", json.code, json.message);
		if (json.code === ErrorCode.VIP_ONLY) return {
			code: ErrorCode.VIP_ONLY,
			message: "该视频只能登陆大会员账号之后下载，如登录后仍然报错，可以尝试清除浏览器cookies和缓存后重试"
		};
		return {
			code: json.code,
			message: json.message ?? "未知错误"
		};
	}
	const info = json.result?.video_info ?? json.data ?? {};
	logInfo(MODULE$1, "bangumi playurl response", {
		hasDash: !!info.dash,
		hasDurl: !!info.durl,
		qualityLabels: info.accept_quality
	});
	updateQualityLabels(info);
	if (info.dash) return buildDashResult(info.dash, quality, info.video_codecid ?? 0);
	if (info.durl) return buildDurlResult(info.durl);
	return {
		code: ErrorCode.UNKNOWN,
		message: "未知错误"
	};
}
//#endregion
//#region src/content-script/main.ts
var MODULE = "main";
var appState = {
	videoInfo: null,
	interval: 0
};
async function getQualityFromPlayer() {
	const el = await waitForElement(".squirtle-quality-select-list li.active, .bpx-player-ctrl-quality-menu .bpx-state-active");
	if (!el) {
		logInfo(MODULE, "getQualityFromPlayer: no quality element found");
		return null;
	}
	let quality = parseInt(el.dataset.value ?? "0", 10);
	if (quality === 0) {
		const first = el.parentElement?.querySelector("li:first-child");
		if (first) quality = parseInt(first.dataset.value ?? "0", 10);
	}
	log("quality from player is", quality);
	return quality;
}
async function getPreferredQuality() {
	let quality = 120;
	try {
		const settingsStr = localStorage.bilibili_player_settings;
		if (settingsStr && settingsStr !== "undefined") {
			quality = JSON.parse(settingsStr).setting_config.defquality ?? 120;
			logInfo(MODULE, "quality from localStorage", { quality });
		}
	} catch {
		logWarn(MODULE, "failed to parse bilibili_player_settings");
	}
	const result = await getQualityFromPlayer() ?? quality;
	logInfo(MODULE, "preferred quality resolved", { result });
	return result;
}
async function fetchInitialState(mode = "next") {
	logInfo(MODULE, "fetchInitialState", { mode });
	try {
		if (mode === "next2025") {
			const win = window;
			if (win.__PLAYURL_HYDRATE_DATA__) {
				logInfo(MODULE, "using __PLAYURL_HYDRATE_DATA__ from window");
				return {
					code: 0,
					data: win.__PLAYURL_HYDRATE_DATA__
				};
			}
		}
		const html = await (await window.fetch(window.location.href, FETCH_DEFAULTS)).text();
		logInfo(MODULE, "page HTML fetched", { length: html.length });
		const next2025Match = html.match(/<script>window\.__INITIAL_STATE__=(.+?)<\/script>/);
		if (next2025Match) {
			const raw = next2025Match[1].replace(/;\(function\(\)\{var s;\(s=document\.currentScript\|\|document\.scripts\[document\.scripts\.length-1\]\)\.parentNode\.removeChild\(s\);\}\)\(\);/, "");
			logInfo(MODULE, "found __INITIAL_STATE__ (next2025)");
			return {
				code: 0,
				data: JSON.parse(raw)
			};
		}
		const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
		if (nextDataMatch) {
			const state = JSON.parse(nextDataMatch[1]).props.pageProps.dehydratedState.queries[0].state;
			logInfo(MODULE, "found __NEXT_DATA__ (next format)", { status: state.status });
			return {
				code: state.status === "success" ? 0 : -1,
				data: state
			};
		}
		logWarn(MODULE, "no initial state found in page HTML");
		return {
			code: ErrorCode.INVALID_RESPONSE,
			message: "获取视频信息失败，可以尝试清除浏览器cookies和缓存后重试"
		};
	} catch (err) {
		logError(MODULE, "fetchInitialState failed", err);
		return {
			code: ErrorCode.FAILED_TO_FETCH,
			message: "网络请求失败"
		};
	}
}
function processPlayUrlResult(dashData, quality) {
	if (!dashData) {
		logWarn(MODULE, "processPlayUrlResult: no data");
		return {
			code: ErrorCode.INVALID_RESPONSE,
			message: "该视频暂时不支持下载"
		};
	}
	const data = dashData;
	if (!data.dash && !data.durl) {
		logWarn(MODULE, "processPlayUrlResult: no dash or durl", { dashData: JSON.stringify(dashData).slice(0, 500) });
		return {
			code: ErrorCode.UNKNOWN,
			message: "未知错误"
		};
	}
	if (data.accept_quality && data.accept_description) data.accept_quality.forEach((q, i) => {
		QUALITY_LABELS[q] = data.accept_description[i] ?? QUALITY_LABELS[q];
	});
	if (data.support_formats) for (const fmt of data.support_formats) QUALITY_LABELS[fmt.quality] = fmt.new_description || fmt.display_desc || QUALITY_LABELS[fmt.quality];
	logInfo(MODULE, "processPlayUrlResult: processing", {
		hasDash: !!data.dash,
		hasDurl: !!data.durl,
		quality
	});
	if (data.dash) {
		const video = data.dash.video.find((v) => `${v.codecid}` === `${data.video_codecid}` && `${v.id}` === `${quality}`) ?? data.dash.video[0];
		const audio = data.dash.audio[0];
		logInfo(MODULE, "DASH stream selected", {
			videoId: video?.id,
			videoCodecid: video?.codecid,
			audioId: audio?.id,
			videoCount: data.dash.video.length,
			audioCount: data.dash.audio.length
		});
		if (audio) {
			log("-".repeat(20));
			log("audio:");
			log("    main link:", audio.base_url);
			audio.backup_url?.forEach((u, i) => {
				log(`    backup link ${i + 1}:`, u);
			});
		}
		if (video) {
			log("-".repeat(20));
			log("video:");
			log("    main link:", video.base_url);
			video.backup_url?.forEach((u, i) => {
				log(`    backup link ${i + 1}:`, u);
			});
		}
		return {
			code: ErrorCode.OK,
			dash: {
				audio,
				video
			},
			qualityDescription: QUALITY_LABELS[video?.id ?? quality] ?? ""
		};
	}
	if (data.durl) {
		logInfo(MODULE, "DURL segments", { count: data.durl.length });
		data.durl.forEach((seg, i) => {
			log(`video segment ${i + 1}:`);
			log("    main link:", seg.url);
			seg.backup_url?.forEach((u, j) => {
				log(`    backup link ${j + 1}:`, u);
			});
		});
		return {
			code: ErrorCode.OK,
			durl: data.durl,
			qualityDescription: QUALITY_LABELS[quality] ?? ""
		};
	}
	return {
		code: ErrorCode.UNKNOWN,
		message: "未知错误"
	};
}
async function processVideoPage() {
	logInfo(MODULE, "processVideoPage: start");
	const state = await fetchInitialState();
	const quality = await getPreferredQuality();
	if (state.code !== ErrorCode.OK) {
		logWarn(MODULE, "processVideoPage: initial state fetch failed", {
			code: state.code,
			message: state.message
		});
		showDownloadInfo({
			code: state.code,
			message: state.message,
			quality: QUALITY_LABELS[quality] ?? ""
		});
		return;
	}
	const videoData = state.data.videoData;
	const avid = videoData.aid;
	const bvid = videoData.bvid;
	let cid = videoData.cid;
	let pageNum;
	let pageTitle;
	if (videoData.pages.length > 1) {
		logInfo(MODULE, "multi-page video detected", { pageCount: videoData.pages.length });
		const pMatch = location.search.match(/p=(\d+)/);
		let currentPage = videoData.pages[0];
		if (pMatch) {
			const found = videoData.pages.find((p) => String(p.page) === pMatch[1]);
			if (found) currentPage = found;
		}
		pageNum = currentPage.page;
		pageTitle = currentPage.part;
		cid = currentPage.cid;
		logInfo(MODULE, "selected page", {
			pageNum,
			cid,
			pageTitle
		});
	}
	logInfo(MODULE, "video info", {
		avid,
		bvid,
		cid,
		quality
	});
	const playResult = await fetchUgcPlayUrl(avid, bvid, cid, quality);
	if (playResult.code === ErrorCode.OK) {
		let title = videoData.title;
		if (pageNum !== void 0 && pageTitle) title = `${videoData.title}_P${pageNum}_${pageTitle}`;
		logInfo(MODULE, "ugc playurl success", {
			title,
			quality: playResult.qualityDescription
		});
		showDownloadInfo({
			code: playResult.code,
			title,
			quality: playResult.qualityDescription,
			dash: playResult.dash,
			durl: playResult.durl
		});
	} else {
		logWarn(MODULE, "ugc playurl failed", {
			code: playResult.code,
			message: playResult.message
		});
		showDownloadInfo({
			code: playResult.code,
			title: videoData.title,
			message: playResult.message
		});
	}
}
async function processBangumiPage(videoInfo) {
	const isNext2025 = !videoInfo;
	const mode = isNext2025 ? "next2025" : "next";
	logInfo(MODULE, "processBangumiPage", {
		isNext2025,
		mode,
		hasInterceptedData: !!videoInfo
	});
	const state = await fetchInitialState(mode);
	const quality = await getPreferredQuality();
	if (state.code !== ErrorCode.OK) {
		logWarn(MODULE, "processBangumiPage: initial state fetch failed", {
			code: state.code,
			message: state.message
		});
		showDownloadInfo({
			code: state.code,
			message: state.message,
			quality: QUALITY_LABELS[quality] ?? ""
		});
		return;
	}
	let episodes = [];
	let episodeInfo = null;
	let mediaTitle = "";
	if (isNext2025) {
		episodeInfo = state.data.result.supplement.ogv_episode_info;
		mediaTitle = document.title.split("-")?.[0]?.trim() ?? "";
		logInfo(MODULE, "next2025 episode info", {
			episodeId: episodeInfo?.episode_id,
			mediaTitle
		});
	} else {
		const data = state.data;
		episodes = data.seasonInfo.mediaInfo.episodes;
		mediaTitle = data.seasonInfo.mediaInfo.title;
		logInfo(MODULE, "next format season info", {
			mediaTitle,
			episodeCount: episodes.length
		});
	}
	const epId = videoInfo?.ep_id ?? episodeInfo?.episode_id;
	const currentEp = isNext2025 ? {
		...episodeInfo,
		titleFormat: episodeInfo.index_title,
		long_title: episodeInfo.long_title
	} : episodes.find((ep) => epId === ep.ep_id);
	logInfo(MODULE, "bangumi episode", {
		epId,
		quality: QUALITY_LABELS[quality] ?? quality
	});
	let cid = videoInfo?.cid;
	if (cid === void 0 && isNext2025) {
		cid = state.data.result.arc.cid;
		logInfo(MODULE, "cid from next2025 arc", { cid });
	}
	let result;
	if (videoInfo && videoInfo.dash) {
		logInfo(MODULE, "using intercepted XHR playurl data");
		result = processPlayUrlResult({
			dash: videoInfo.dash,
			video_codecid: void 0,
			accept_quality: void 0,
			accept_description: void 0,
			support_formats: void 0
		}, quality);
	} else if (epId !== void 0 && cid !== void 0) {
		logInfo(MODULE, "fetching bangumi playurl", {
			epId,
			cid,
			quality
		});
		result = await fetchBangumiPlayUrl(epId, cid, quality);
	} else {
		logWarn(MODULE, "cannot determine epId or cid", {
			epId,
			cid
		});
		result = {
			code: ErrorCode.INVALID_RESPONSE,
			message: "未能获取番剧分集信息"
		};
	}
	if (result.dash || result.durl) {
		const title = isNext2025 ? `${mediaTitle}_${episodeInfo.index_title}_${episodeInfo.long_title}` : `${mediaTitle}_${currentEp?.titleFormat || currentEp?.title || ""}_${currentEp?.long_title || ""}`;
		logInfo(MODULE, "bangumi download info ready", {
			title,
			quality: result.qualityDescription
		});
		showDownloadInfo({
			code: result.code,
			title,
			dash: result.dash,
			durl: result.durl,
			quality: result.qualityDescription
		});
	} else {
		logWarn(MODULE, "bangumi fetch failed", {
			code: result.code,
			message: result.message
		});
		showDownloadInfo({
			code: result.code,
			title: mediaTitle,
			message: result.message
		});
	}
}
function interceptXMLHttpRequest(onPlayUrl, originalXHR, onReady) {
	let executed = false;
	logInfo(MODULE, "XHR interception active, waiting for /playurl response");
	setTimeout(() => {
		if (!executed) {
			logInfo(MODULE, "XHR timeout (3s) — no /playurl intercepted, falling back to fresh fetch");
			onReady();
		}
	}, 3e3);
	window.XMLHttpRequest = class extends originalXHR {
		constructor() {
			super();
			this.addEventListener("load", () => {
				if (this.responseURL.includes("/playurl")) {
					logInfo(MODULE, "XHR intercepted /playurl", { responseURL: this.responseURL.slice(0, 200) });
					const params = new URLSearchParams(this.responseURL);
					const avid = params.get("avid");
					const cid = params.get("cid");
					const bvid = params.get("bvid");
					const epId = params.get("ep_id");
					const response = JSON.parse(this.responseText);
					logInfo(MODULE, "XHR playurl response code", { code: response.code });
					const info = response.result?.video_info || response.data || {};
					info.avid = avid ? +avid : void 0;
					info.cid = cid ? +cid : void 0;
					if (bvid) info.bvid = bvid;
					info.ep_id = epId ? +epId : void 0;
					logInfo(MODULE, "intercepted video info", {
						avid: info.avid,
						cid: info.cid,
						epId: info.ep_id,
						hasDash: !!info.dash,
						hasDurl: !!info.durl
					});
					onPlayUrl(info);
					executed = true;
				}
			}, {
				capture: true,
				passive: true
			});
		}
	};
}
function startWatching(onChange, timer) {
	logInfo(MODULE, "startWatching: setting up quality and URL change observers");
	waitForElement(".bpx-player-ctrl-quality-result").then((el) => {
		if (!el) {
			logWarn(MODULE, "startWatching: quality label element not found");
			return;
		}
		let lastText = el.textContent ?? "";
		logInfo(MODULE, "startWatching: quality observer attached");
		new MutationObserver((mutations) => {
			const text = mutations[0]?.addedNodes?.[0]?.textContent ?? lastText;
			if (lastText !== text) {
				logInfo(MODULE, "quality label changed", {
					from: lastText,
					to: text
				});
				lastText = text;
				clearLogs();
				onChange();
			}
		}).observe(el, { childList: true });
	});
	timer.interval = window.setInterval(() => {
		const currentUrl = window.location.href;
		if (appState.interval !== 0) {
			if (currentUrl !== appState._lastUrl) logInfo(MODULE, "URL change detected", {
				from: appState._lastUrl,
				to: currentUrl
			});
			clearLogs();
			appState.interval = window.setTimeout(onChange, 0);
		}
		appState._lastUrl = currentUrl;
	}, 1e3);
}
(async function main(win) {
	logInfo(MODULE, "content script starting", {
		url: win.location.href,
		userAgent: win.navigator.userAgent.slice(0, 80)
	});
	const originalXHR = XMLHttpRequest;
	const refresh = async () => {
		if (!isBilibili()) {
			logWarn(MODULE, "refresh: not on bilibili.com, skipping");
			return;
		}
		showDownloadInfo({ code: ErrorCode.OK }, true);
		if (isVideoPage()) {
			logInfo(MODULE, "page type: video (UGC)");
			await processVideoPage();
		} else if (isBangumiPage()) {
			logInfo(MODULE, "page type: bangumi");
			await processBangumiPage(appState.videoInfo);
		} else logInfo(MODULE, "page type: other (not video or bangumi), waiting for player");
	};
	if (isBangumiPage()) {
		logInfo(MODULE, "setting up XHR interception for bangumi page");
		interceptXMLHttpRequest((info) => {
			appState.videoInfo = info;
			waitForElement("#bilibili-player .squirtle-quality-wrap, #bilibili-player .bpx-player-ctrl-quality").then(() => {
				logInfo(MODULE, "bangumi player ready, refreshing");
				refresh();
			});
		}, originalXHR, () => {
			waitForElement("#bilibili-player .squirtle-quality-wrap, #bilibili-player .bpx-player-ctrl-quality").then(() => {
				logInfo(MODULE, "bangumi ready (fallback), refreshing");
				refresh();
			});
		});
	} else {
		logInfo(MODULE, "waiting for player element on non-bangumi page");
		waitForElement("#bilibili-player .squirtle-quality-wrap, #bilibili-player .bpx-player-ctrl-quality").then(() => {
			logInfo(MODULE, "player ready, refreshing");
			refresh();
		});
	}
	logInfo(MODULE, "starting watchers and FFmpeg cleanup");
	startWatching(refresh, appState);
	setupCleanup();
})(window);
//#endregion
