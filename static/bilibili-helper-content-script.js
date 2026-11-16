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
var FFMPEG_WORKER = "ffmpeg.worker.js";
var FFMPEG_CORE_JS = "ffmpeg-core.js";
var FFMPEG_CORE_WASM = "ffmpeg-core.wasm";
var UGC_PLAY_URL_API = "https://api.bilibili.com/x/player/wbi/playurl";
var BANGUMI_PLAY_URL_API = "https://api.bilibili.com/pgc/player/web/v2/playurl";
var NAV_API = "https://api.bilibili.com/x/web-interface/nav";
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
var isVideoPage = () => /\/video\/(av|bv)[0-9a-zA-Z]+/i.test(window.location.pathname);
var isBangumiPage = () => /\/bangumi\/play\/\S+/i.test(window.location.pathname);
function formatSize(bytes) {
	if (!bytes) return "未知大小";
	if (bytes >= 1073741824) return `${(bytes / GB).toFixed(2)}GB`;
	if (bytes >= 1048576) return `${(bytes / MB).toFixed(2)}MB`;
	if (bytes >= 1024) return `${(bytes / KB).toFixed(2)}KB`;
	return `${bytes}B`;
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
async function fileToUint8Array(file) {
	try {
		return new Uint8Array(await file.arrayBuffer());
	} catch {
		throw new Error("Unable to read file data. Please try the download again.");
	}
}
/**
* Trigger a browser save for `blob` and return its object URL. The caller owns
* the URL (it backs the "save again" link) and must revoke it when done.
*/
function saveBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	return url;
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
var UBLOCK_PREVENT_FETCH_FRAME = /chrome-extension:\/\/[^/\s]+\/rulesets\/scripting\/scriptlet\/ublock-filters\.prevent-fetch\.js/i;
var UNSUPPORTED_BILIBILI_STREAM_URL_ERROR = "Unsupported Bilibili stream URL";
function dispatchContentScriptError(error, module) {
	if (typeof window === "undefined") return;
	if (error instanceof Error && UBLOCK_PREVENT_FETCH_FRAME.test(error.stack ?? "")) return;
	if (error instanceof Error && error.message === UNSUPPORTED_BILIBILI_STREAM_URL_ERROR || error === UNSUPPORTED_BILIBILI_STREAM_URL_ERROR) return;
	const message = createSentryErrorMessage(error, "content-script", module);
	window.dispatchEvent(new CustomEvent(CONTENT_SCRIPT_ERROR_EVENT, { detail: message }));
}
//#endregion
//#region src/lib/logger.ts
/**
* Structured logger for the Bilibili download helper extension.
*
* Provides module-prefixed logging at three severity levels (info, warn, error)
* and writes to both the browser console and the in-page UI log panel.
*
* Use instead of raw console.log / the host.ts `log()` function directly,
* so every log message carries a module tag and timestamp for debugging.
*/
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
	const error = args.find((arg) => arg instanceof Error);
	if (error) dispatchContentScriptError(error, module);
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
var MODULE$6 = "fetch";
/**
* Fetch a URL and return its contents as an ArrayBuffer.
* Supports progress callbacks via streaming.
*/
async function fetchWithProgress(url, onProgress) {
	const response = await fetch(url, STREAM_FETCH_DEFAULTS);
	let result;
	try {
		const contentLength = parseInt(response.headers.get("Content-Length") ?? "-1", 10);
		if (contentLength > 0) logInfo(MODULE$6, "fetchWithProgress: streaming", {
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
		logWarn(MODULE$6, "streaming failed, falling back to arrayBuffer", err);
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
	logInfo(MODULE$6, "fetchAsBlob", {
		url: url.slice(0, 80),
		mimeType,
		streaming
	});
	const data = streaming ? await fetchWithProgress(url, onProgress) : await (await fetch(url, STREAM_FETCH_DEFAULTS)).arrayBuffer();
	const blob = new Blob([data], { type: mimeType });
	const blobUrl = URL.createObjectURL(blob);
	logInfo(MODULE$6, "fetchAsBlob: blob created", {
		blobUrl: blobUrl.slice(0, 40),
		size: data.byteLength
	});
	return blobUrl;
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
			logInfo(MODULE$6, "toUint8Array: decoded base64 data URI", { size: bytes.length });
			return bytes;
		}
		const done = logFetch(MODULE$6, input.slice(0, 120), "GET");
		let response;
		try {
			response = await fetch(input, STREAM_FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			throw err;
		}
		done(response);
		const buf = await response.arrayBuffer();
		logInfo(MODULE$6, "toUint8Array: fetched", { size: buf.byteLength });
		return new Uint8Array(buf);
	}
	if (input instanceof URL) {
		const done = logFetch(MODULE$6, input.toString(), "GET");
		let response;
		try {
			response = await fetch(input, STREAM_FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			throw err;
		}
		done(response);
		const buf = await response.arrayBuffer();
		logInfo(MODULE$6, "toUint8Array: fetched URL", { size: buf.byteLength });
		return new Uint8Array(buf);
	}
	logInfo(MODULE$6, "toUint8Array: reading File/Blob", {
		type: input.type,
		size: input.size
	});
	return fileToUint8Array(input);
}
//#endregion
//#region src/lib/ffmpeg.ts
var ffmpegInstance = null;
var ffmpegLoadPromise = null;
var usedFiles = /* @__PURE__ */ new Set();
var blobUrls = /* @__PURE__ */ new Set();
function trackBlobUrl(url) {
	blobUrls.add(url);
}
async function getFFmpeg(baseUrl) {
	if (ffmpegInstance?.loaded) {
		logInfo("ffmpeg", "reusing existing FFmpeg instance");
		return ffmpegInstance;
	}
	if (ffmpegLoadPromise) {
		logInfo("ffmpeg", "waiting for FFmpeg instance to load");
		return ffmpegLoadPromise;
	}
	ffmpegInstance = null;
	const loadPromise = (async () => {
		logInfo("ffmpeg", "initializing new FFmpeg instance");
		const inst = new FFmpeg();
		inst.on("log", ({ message }) => {
			console.log("[bilibili downloader]", "[ffmpeg]", message);
		});
		logInfo("ffmpeg", "fetching FFmpeg assets as blobs from", baseUrl);
		const [workerUrl, coreUrl, wasmUrl] = await Promise.all([
			fetchAsBlob(`${baseUrl}/${FFMPEG_WORKER}`, "text/javascript"),
			fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_JS}`, "text/javascript"),
			fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_WASM}`, "application/wasm")
		]);
		trackBlobUrl(workerUrl);
		trackBlobUrl(coreUrl);
		trackBlobUrl(wasmUrl);
		logInfo("ffmpeg", "FFmpeg blobs ready, loading...");
		try {
			await inst.load({
				classWorkerURL: workerUrl,
				coreURL: coreUrl,
				wasmURL: wasmUrl
			});
			logInfo("ffmpeg", "FFmpeg loaded successfully");
		} catch (err) {
			logError("ffmpeg", "FFmpeg load failed", err);
			throw err;
		}
		ffmpegInstance = inst;
		return inst;
	})();
	ffmpegLoadPromise = loadPromise;
	try {
		return await loadPromise;
	} finally {
		if (ffmpegLoadPromise === loadPromise) ffmpegLoadPromise = null;
	}
}
/**
* Merge audio and video using FFmpeg, return the merged data buffer.
*/
async function mergeAudioVideo(baseUrl, audio, video) {
	logInfo("ffmpeg", "mergeAudioVideo: starting merge");
	const ffmpeg = await getFFmpeg(baseUrl);
	const ts = `${Date.now()}${Math.random()}`;
	const audioFile = `${ts}_audio.mp4`;
	const videoFile = `${ts}_video.mp4`;
	const mergedFile = `${ts}_merged.mp4`;
	logInfo("ffmpeg", `writing audio file (${audioFile})`);
	await ffmpeg.writeFile(audioFile, await toUint8Array(audio));
	logInfo("ffmpeg", `writing video file (${videoFile})`);
	await ffmpeg.writeFile(videoFile, await toUint8Array(video));
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
//#region src/lib/stream-download-protocol.ts
var STREAM_FETCH_SOURCE = "bilibili-helper-stream-fetch";
var STREAM_FETCH_REQUEST_TYPE = "bilibili-helper:stream-fetch";
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
function isSequence(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isPageStreamMessage(value) {
	if (!value || typeof value !== "object") return false;
	const message = value;
	switch (message.type) {
		case "response": return Number.isInteger(message.status) && typeof message.statusText === "string" && (message.contentLength === null || typeof message.contentLength === "string");
		case "chunk": return isSequence(message.sequence) && message.buffer instanceof ArrayBuffer;
		case "done": return true;
		case "error": return typeof message.message === "string";
		default: return false;
	}
}
//#endregion
//#region src/lib/stream-download-client.ts
var RESPONSE_TIMEOUT_MS = 15e3;
function abortError() {
	return new DOMException("The operation was aborted", "AbortError");
}
/**
* Request a CDN response through the isolated content script and extension
* service worker. Page-world fetch is subject to Bilibili's CORS policy.
*/
function fetchStreamThroughExtension(url, signal) {
	if (!isAllowedStreamUrl(url)) return Promise.reject(/* @__PURE__ */ new Error("Unsupported Bilibili stream URL"));
	if (signal?.aborted) return Promise.reject(abortError());
	return new Promise((resolve, reject) => {
		const channel = new MessageChannel();
		let responseReceived = false;
		let settled = false;
		let streamController;
		let pendingAcknowledgement;
		let responseTimer;
		const cleanup = () => {
			clearTimeout(responseTimer);
			signal?.removeEventListener("abort", onAbort);
			channel.port1.onmessage = null;
			channel.port1.onmessageerror = null;
			channel.port1.close();
		};
		const sendAbort = () => {
			try {
				channel.port1.postMessage({ type: "abort" });
			} catch {}
		};
		const fail = (error) => {
			if (settled) return;
			sendAbort();
			settled = true;
			if (responseReceived) try {
				streamController?.error(error);
			} catch {}
			else reject(error);
			cleanup();
		};
		const onAbort = () => {
			fail(abortError());
		};
		const body = new ReadableStream({
			start(controller) {
				streamController = controller;
			},
			pull() {
				if (pendingAcknowledgement === void 0) return;
				const sequence = pendingAcknowledgement;
				pendingAcknowledgement = void 0;
				try {
					channel.port1.postMessage({
						type: "ack",
						sequence
					});
				} catch (error) {
					fail(error instanceof Error ? error : new Error(String(error)));
				}
			},
			cancel() {
				if (settled) return;
				sendAbort();
				settled = true;
				cleanup();
			}
		}, { highWaterMark: 1 });
		responseTimer = setTimeout(() => {
			fail(/* @__PURE__ */ new Error("Timed out waiting for the extension stream worker"));
		}, RESPONSE_TIMEOUT_MS);
		channel.port1.onmessage = (event) => {
			if (!isPageStreamMessage(event.data)) {
				fail(/* @__PURE__ */ new Error("Invalid response from the extension stream worker"));
				return;
			}
			const message = event.data;
			if (message.type === "response") {
				if (responseReceived || settled) {
					fail(/* @__PURE__ */ new Error("Duplicate response from the extension stream worker"));
					return;
				}
				try {
					const headers = new Headers();
					if (message.contentLength && /^\d+$/.test(message.contentLength)) headers.set("content-length", message.contentLength);
					const responseBody = message.status === 204 || message.status === 205 || message.status === 304 ? null : body;
					const response = new Response(responseBody, {
						status: message.status,
						statusText: message.statusText,
						headers
					});
					responseReceived = true;
					clearTimeout(responseTimer);
					resolve(response);
				} catch (error) {
					fail(error instanceof Error ? error : new Error(String(error)));
				}
				return;
			}
			if (message.type === "chunk") {
				if (!responseReceived || settled) {
					fail(/* @__PURE__ */ new Error("Received stream data before response headers"));
					return;
				}
				if (pendingAcknowledgement !== void 0) {
					fail(/* @__PURE__ */ new Error("Received a stream chunk before acknowledging the previous chunk"));
					return;
				}
				try {
					const buffer = message.buffer;
					if (!(buffer instanceof ArrayBuffer)) {
						fail(/* @__PURE__ */ new Error("Invalid stream chunk from extension worker"));
						return;
					}
					pendingAcknowledgement = message.sequence;
					streamController?.enqueue(new Uint8Array(buffer));
				} catch (error) {
					fail(error instanceof Error ? error : new Error(String(error)));
				}
				return;
			}
			if (message.type === "done") {
				if (!responseReceived) {
					fail(/* @__PURE__ */ new Error("Stream ended before response headers"));
					return;
				}
				if (pendingAcknowledgement !== void 0) {
					fail(/* @__PURE__ */ new Error("Stream ended before the last chunk was acknowledged"));
					return;
				}
				if (!settled) {
					settled = true;
					try {
						streamController?.close();
					} catch {}
					cleanup();
				}
				return;
			}
			fail(new Error(message.message || "Extension stream request failed"));
		};
		channel.port1.onmessageerror = () => {
			fail(/* @__PURE__ */ new Error("Could not read a message from the extension stream worker"));
		};
		channel.port1.start();
		signal?.addEventListener("abort", onAbort, { once: true });
		try {
			window.postMessage({
				source: STREAM_FETCH_SOURCE,
				type: "request",
				url,
				requestType: STREAM_FETCH_REQUEST_TYPE
			}, window.location.origin, [channel.port2]);
		} catch (error) {
			fail(error instanceof Error ? error : new Error(String(error)));
		}
	});
}
//#endregion
//#region src/lib/downloader/stream-fetch.ts
/**
* Robust stream fetcher for Bilibili CDN .m4s / .mp4 segments.
*
* The modern Bilibili CDN (upos-sz-mirror*.bilivideo.com) serves segments as
* `206 Partial Content` with signed `deadline`-bounded URLs, and each stream
* comes with a `backup_url` array. This fetcher:
*
*   - Tries the primary URL, then each backup URL in order on failure.
*   - Streams the response body with a progress callback.
*   - Falls back to a non-streaming arrayBuffer() if the reader is unavailable.
*   - Honors STREAM_FETCH_DEFAULTS (Referer pinned to bilibili.com) so the CDN
*     doesn't 403 the request.
*/
var MODULE$5 = "stream";
/**
* Fetch a single URL with streaming progress and exponential backoff
* on network errors, rate-limits and server errors. Does NOT handle
* fallbacks (fetchSegment does that). Throws when all retries are
* exhausted.
*/
async function fetchOne(url, onProgress, signal, maxRetries = 2) {
	for (let attempt = 0;; attempt++) {
		let response;
		try {
			response = await fetchStreamThroughExtension(url, signal);
		} catch (err) {
			if (signal?.aborted) throw err;
			if (err instanceof Error && err.message === "Unsupported Bilibili stream URL") throw err;
			if (attempt < maxRetries) {
				const delay = Math.min(1e3 * Math.pow(2, attempt), 1e4);
				logWarn(MODULE$5, `network error, retry ${attempt + 1}/${maxRetries} in ${delay}ms`, {
					url: url.slice(0, 80),
					error: err.message
				});
				await new Promise((r) => setTimeout(r, delay));
				continue;
			}
			throw err;
		}
		if (!response.ok) {
			const status = response.status;
			if (attempt < maxRetries && (status === 429 || status >= 500)) {
				const delay = Math.min(1e3 * Math.pow(2, attempt), 3e4);
				logWarn(MODULE$5, `HTTP ${status}, retry ${attempt + 1}/${maxRetries} in ${delay}ms`, { url: url.slice(0, 80) });
				await new Promise((r) => setTimeout(r, delay));
				continue;
			}
			throw new Error(`HTTP ${status} ${response.statusText}`);
		}
		const contentLength = parseInt(response.headers.get("content-length") ?? "-1", 10);
		let received = 0;
		const reader = response.body?.getReader();
		if (!reader) {
			logWarn(MODULE$5, "no body reader, falling back to arrayBuffer", { url: url.slice(0, 80) });
			const buf = await response.arrayBuffer();
			onProgress?.({
				total: buf.byteLength,
				received: buf.byteLength,
				done: true
			});
			return new Blob([buf]);
		}
		const chunks = [];
		let aborted = false;
		try {
			for (;;) {
				const result = await reader.read();
				if (result.done) {
					onProgress?.({
						total: contentLength,
						received,
						done: true
					});
					break;
				}
				chunks.push(result.value);
				received += result.value.byteLength;
				onProgress?.({
					total: contentLength,
					received,
					done: false
				});
			}
		} catch (err) {
			aborted = true;
			logWarn(MODULE$5, `read stream error, retry ${attempt + 1}/${maxRetries}`, {
				url: url.slice(0, 80),
				error: err.message
			});
			await reader.cancel().catch(() => {});
			if (signal?.aborted) throw err;
			if (attempt < maxRetries) continue;
			throw err;
		}
		if (aborted) continue;
		const merged = new Blob(chunks);
		logInfo(MODULE$5, "fetchOne complete", {
			url: url.slice(0, 80),
			received,
			blobSize: merged.size,
			contentLength
		});
		return merged;
	}
}
/**
* Fetch a segment from a list of candidate URLs (primary first, then backups).
*
* On network/HTTP errors, advances to the next backup URL. Returns the Blob
* and the URL that succeeded.
*/
async function fetchSegment(urls, onProgress, signal) {
	if (urls.length === 0) throw new Error("fetchSegment: no URLs provided");
	let lastErr;
	const failures = [];
	for (let i = 0; i < urls.length; i++) {
		const url = urls[i];
		if (i > 0) logWarn(MODULE$5, `trying backup URL ${i}`, { url: url.slice(0, 80) });
		try {
			return {
				blob: await fetchOne(url, onProgress, signal),
				usedUrl: url
			};
		} catch (err) {
			if (signal?.aborted || err instanceof Error && err.name === "AbortError") throw err;
			lastErr = err;
			const error = err instanceof Error ? err.message : String(err);
			const statusMatch = /^HTTP (\d+)/.exec(error);
			const isUnsupportedUrl = error === "Unsupported Bilibili stream URL";
			const failure = {
				url: url.slice(0, 80),
				type: statusMatch ? "http" : isUnsupportedUrl ? "validation" : "network",
				...statusMatch ? { status: Number(statusMatch[1]) } : {},
				error
			};
			failures.push(failure);
			logWarn(MODULE$5, `fetch failed for URL ${i}`, failure);
		}
	}
	const lastErrorMessage = lastErr instanceof Error ? lastErr.message : String(lastErr);
	const failureSummary = failures.map((failure) => failure.type === "http" ? `HTTP ${failure.status} at ${failure.url}: ${failure.error}` : failure.type === "validation" ? `invalid URL at ${failure.url}: ${failure.error}` : `network error at ${failure.url}: ${failure.error}`).join("; ");
	if (failures.every((failure) => failure.type === "validation")) throw lastErr;
	const terminalError = /* @__PURE__ */ new Error(`all segment URLs failed; ${failureSummary}; last error: ${lastErrorMessage}`);
	logError(MODULE$5, "all segment URLs failed", {
		candidateCount: urls.length,
		failures
	}, terminalError);
	throw terminalError;
}
/**
* Collect all candidate URLs for a stream into a flat array: primary first,
* then backups. Tolerates missing/empty fields.
*/
function collectUrls(stream) {
	return [stream.base_url ?? stream.baseUrl ?? "", ...stream.backup_url ?? stream.backupUrl ?? []].filter((u) => !!u && typeof u === "string");
}
//#endregion
//#region src/lib/downloader/orchestration.ts
/**
* Download orchestration for Bilibili streams, decoupled from UI rendering.
*
* Three flows:
*   - downloadStream: fetch a single segment (primary + backup fallback chain).
*   - downloadAndMerge: fetch audio + video in parallel, then merge via FFmpeg.
*   - downloadDurlSegments: fetch a sequence of DURL segments and concatenate.
*
* Progress is reported via callbacks so the UI layer can render it however it
* likes. This module never touches the DOM.
*/
var MODULE$4 = "dl-orch";
/** Normalize a stream (audio/video) into a SegmentDescriptor. */
function streamToSegment(stream) {
	const urls = collectUrls(stream);
	return {
		url: urls[0] ?? "",
		backups: urls.slice(1),
		size: stream.size
	};
}
/**
* Download a single segment to a Blob, with primary→backup fallback and progress.
*/
async function downloadStream(segment, onProgress) {
	const urls = [segment.url, ...segment.backups ?? []].filter(Boolean);
	if (urls.length === 0) throw new Error("downloadStream: segment has no usable URLs");
	logInfo(MODULE$4, "downloadStream start", {
		urlCount: urls.length,
		size: segment.size
	});
	return fetchSegment(urls, ({ received, total, done }) => {
		if (!done) onProgress?.(received, total);
	}).then((r) => r.blob);
}
/**
* Download audio + video in parallel, then merge into a single .mp4.
* Returns the merged ArrayBuffer and a cleanup function for FFmpeg temp files.
*/
async function downloadAndMerge(segments, onProgress, onMerging) {
	logInfo(MODULE$4, "downloadAndMerge start", {
		audioUrl: segments.audio.url.slice(0, 80),
		videoUrl: segments.video.url.slice(0, 80)
	});
	const [audioBlob, videoBlob] = await Promise.all([downloadStream(segments.audio, (r, t) => onProgress?.("audio", r, t)).catch((err) => {
		throw new Error(`audio download failed: ${err.message}`);
	}), downloadStream(segments.video, (r, t) => onProgress?.("video", r, t)).catch((err) => {
		throw new Error(`video download failed: ${err.message}`);
	})]);
	logInfo(MODULE$4, "downloadAndMerge: both streams downloaded", {
		audioSize: audioBlob.size,
		videoSize: videoBlob.size
	});
	onMerging?.();
	const { baseUrl } = getInternals();
	const [data, cleanup] = await mergeAudioVideo(baseUrl, audioBlob, videoBlob);
	logInfo(MODULE$4, "downloadAndMerge: merge complete", { mergedSize: data.byteLength });
	return {
		data,
		cleanup
	};
}
/** Derive a file extension from a segment URL, mapping .m4s → .mp4. */
function extensionForUrl(url) {
	const ext = new URL(url).pathname.toLowerCase().match(/\.[a-z0-9]+?$/)?.[0] ?? "";
	return ext === ".m4s" ? ".mp4" : ext;
}
//#endregion
//#region src/lib/popup/tasks.ts
/**
* Per-option download state for the popup. Lives outside the DOM so progress
* survives closing and reopening the popup, and so the toolbar button can show
* overall progress while the popup is closed.
*/
/**
* A saved file's object URL must outlive the anchor click that starts the
* browser download, so URLs for files nobody can re-save are released late.
*/
var RELEASE_AFTER_SAVE_MS = 6e4;
function errorMessage(err) {
	return err instanceof Error ? err.message : String(err);
}
var DownloadTasks = class {
	deps;
	states = /* @__PURE__ */ new Map();
	listeners = /* @__PURE__ */ new Set();
	/** The live attempt per option; callbacks from any other attempt are stale. */
	attempts = /* @__PURE__ */ new Map();
	/** Option ids currently offered, or null before the first retain(). */
	retained = null;
	pendingReleases = /* @__PURE__ */ new Map();
	constructor(deps) {
		this.deps = deps;
	}
	get(id) {
		return this.states.get(id);
	}
	isActive(id) {
		const status = this.states.get(id)?.status;
		return status === "downloading" || status === "merging";
	}
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	summary() {
		let active = 0;
		let received = 0;
		let total = 0;
		for (const state of this.states.values()) if (state.status === "downloading") {
			active++;
			if (state.total > 0) {
				received += Math.min(state.received, state.total);
				total += state.total;
			}
		} else if (state.status === "merging") active++;
		return {
			active,
			percent: total > 0 ? Math.floor(received / total * 100) : null
		};
	}
	/** Start (or restart) a download. A second start while one is running is ignored. */
	async start(option) {
		if (this.isActive(option.id)) return;
		this.forget(option.id);
		const attempt = Symbol(option.id);
		this.attempts.set(option.id, attempt);
		const live = () => this.attempts.get(option.id) === attempt;
		const startedAt = this.deps.now();
		const progress = (received, total) => {
			if (live()) this.set(option.id, {
				status: "downloading",
				received,
				total,
				startedAt
			});
		};
		const merging = () => {
			if (!live()) return;
			this.set(option.id, { status: "merging" });
			this.deps.log(`正在合并音视频 ${option.filename}`);
		};
		progress(0, option.size ?? 0);
		this.deps.log(`开始下载 ${option.filename}`);
		let finalState;
		try {
			const blob = option.kind === "merged" ? await this.runMerged(option, progress, merging) : await this.runSingle(option, progress);
			finalState = {
				status: "done",
				url: this.deps.saveBlob(blob, option.filename),
				size: blob.size
			};
			this.deps.log(`已保存 ${option.filename}（${formatSize(blob.size)}）`);
		} catch (err) {
			const message = errorMessage(err);
			finalState = {
				status: "error",
				message
			};
			this.deps.log(`下载失败 ${option.filename}：${message}`);
		}
		this.attempts.delete(option.id);
		if (this.retained && !this.retained.has(option.id)) {
			if (finalState.status === "done") this.releaseLater(finalState.url);
			this.states.delete(option.id);
			this.emit(option.id);
			return;
		}
		this.set(option.id, finalState);
	}
	/** Drop finished/failed state (revoking its object URL). Running downloads are kept. */
	forget(id) {
		const state = this.states.get(id);
		if (!state || this.isActive(id)) return;
		if (state.status === "done") this.deps.revokeUrl(state.url);
		this.states.delete(id);
		this.emit(id);
	}
	/** Forget everything not in `ids`, e.g. after a quality or episode change. */
	retain(ids) {
		this.retained = new Set(ids);
		for (const id of [...this.states.keys()]) if (!ids.has(id)) this.forget(id);
	}
	dispose() {
		for (const state of this.states.values()) if (state.status === "done") this.deps.revokeUrl(state.url);
		for (const [url, timer] of this.pendingReleases) {
			clearTimeout(timer);
			this.deps.revokeUrl(url);
		}
		this.pendingReleases.clear();
		this.states.clear();
		this.attempts.clear();
		this.listeners.clear();
	}
	releaseLater(url) {
		const timer = setTimeout(() => {
			this.pendingReleases.delete(url);
			this.deps.revokeUrl(url);
		}, RELEASE_AFTER_SAVE_MS);
		this.pendingReleases.set(url, timer);
	}
	async runSingle(option, progress) {
		const fallbackTotal = option.size ?? 0;
		return this.deps.downloadStream(option.segments[0], (received, total) => progress(received, total > 0 ? total : fallbackTotal));
	}
	async runMerged(option, progress, merging) {
		const [audio, video] = option.segments;
		const parts = {
			audio: {
				received: 0,
				total: audio.size ?? 0
			},
			video: {
				received: 0,
				total: video.size ?? 0
			}
		};
		const { data, cleanup } = await this.deps.downloadAndMerge({
			audio,
			video
		}, (which, received, total) => {
			parts[which] = {
				received,
				total: total > 0 ? total : parts[which].total
			};
			const known = parts.audio.total > 0 && parts.video.total > 0;
			progress(parts.audio.received + parts.video.received, known ? parts.audio.total + parts.video.total : 0);
		}, merging);
		try {
			return new Blob([data], { type: "video/mp4" });
		} finally {
			cleanup();
		}
	}
	set(id, state) {
		this.states.set(id, state);
		this.emit(id);
	}
	emit(id) {
		for (const listener of this.listeners) listener(id);
	}
};
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	var _padding$top, _padding$right, _padding$bottom, _padding$left;
	return {
		top: (_padding$top = padding.top) != null ? _padding$top : 0,
		right: (_padding$right = padding.right) != null ? _padding$right : 0,
		bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
		left: (_padding$left = padding.left) != null ? _padding$left : 0
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	const alignment = getAlignment(placement);
	if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement":
						resetPlacement = initialPlacement;
						break;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const clampCoord = (axis, coord) => clamp(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
			if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
			if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const shiftData = state.middlewareData.shift;
			const noShift = !shiftData;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
			if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
			else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) if (offsetParent) {
		if (isElement(offsetParent)) scale = getScale(offsetParent);
	} else scale = getScale(element);
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement && offsetParent) {
		const win = getWindow(domElement);
		const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
function getDocumentRect(html) {
	const scroll = getNodeScroll(html);
	const body = html.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(html);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
	if (rootBoundary === void 0) rootBoundary = "viewport";
	const isLayoutViewport = rootBoundary === "layoutViewport";
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
		if (isLayoutViewport) {
			if (!layoutRelativeClientCoords) {
				x = -visualViewport.offsetLeft;
				y = -visualViewport.offsetTop;
			}
		} else {
			width = visualViewport.width;
			height = visualViewport.height;
			if (layoutRelativeClientCoords) {
				x = visualViewport.offsetLeft;
				y = visualViewport.offsetTop;
			}
		}
	}
	if (getWindowScrollBarX(html) <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
		if (gutter <= SCROLLBAR_MAX) width -= gutter;
	}
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = getScale(element);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let lastKeptComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
		if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
		else lastKeptComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove, ancestorResize) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) return refresh();
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	const win = getWindow(element);
	const handleResize = () => refresh(ancestorResize);
	win.addEventListener("resize", handleResize);
	refresh(true);
	return () => {
		win.removeEventListener("resize", handleResize);
		cleanup();
	};
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update);
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = offset$1;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = shift$1;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = flip$1;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = size$1;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = options != null ? options : {};
	const platformWithCache = {
		...platform,
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
//#endregion
//#region src/lib/download.ts
/**
* Download options model for the popup. Turns a playurl result into the
* concrete files a user can save (merged MP4, video-only, audio-only, or DURL
* files), each with its segments, filename and known size. Pure data: no DOM,
* no network.
*/
var RESERVED_FILENAME_CHARS = /[\\/:*?"<>|]/g;
var MAX_FILENAME_LENGTH = 180;
function sanitizeFilename(name) {
	return Array.from(name, (c) => c.charCodeAt(0) < 32 ? " " : c).join("").replace(RESERVED_FILENAME_CHARS, "_").replace(/\s+/g, " ").trim().replace(/^\.+|\.+$/g, "").slice(0, MAX_FILENAME_LENGTH) || "bilibili";
}
function safeExtension(url, fallback) {
	try {
		return extensionForUrl(url) || fallback;
	} catch {
		return fallback;
	}
}
function knownSum(sizes) {
	if (sizes.some((s) => !s)) return void 0;
	return sizes.reduce((sum, s) => sum + (s ?? 0), 0);
}
function buildDownloadOptions(info) {
	if (info.code !== ErrorCode.OK) return [];
	const base = sanitizeFilename(info.title || "bilibili");
	if (info.dash) {
		const audio = streamToSegment(info.dash.audio);
		const video = streamToSegment(info.dash.video);
		const options = [];
		if (audio.url && video.url) options.push({
			id: `merged:${video.url}`,
			kind: "merged",
			label: "完整视频",
			detail: "画面 + 声音",
			format: "MP4",
			filename: `${base}.mp4`,
			segments: [audio, video],
			size: knownSum([audio.size, video.size]),
			recommended: true
		});
		if (video.url) options.push({
			id: `video:${video.url}`,
			kind: "video",
			label: "仅画面",
			detail: "无声音",
			format: "MP4",
			filename: `${base}_视频.mp4`,
			segments: [video],
			size: video.size,
			recommended: false
		});
		if (audio.url) options.push({
			id: `audio:${audio.url}`,
			kind: "audio",
			label: "仅声音",
			detail: "音频轨",
			format: "M4A",
			filename: `${base}_音频.m4a`,
			segments: [audio],
			size: audio.size,
			recommended: false
		});
		return options;
	}
	const durl = (info.durl ?? []).filter((seg) => !!seg.url);
	const multiple = durl.length > 1;
	return durl.map((seg, i) => {
		const ext = safeExtension(seg.url, ".flv");
		return {
			id: `file:${seg.url}`,
			kind: "file",
			label: multiple ? `分段 ${i + 1}/${durl.length}` : "完整视频",
			detail: multiple ? `第 ${i + 1} 段` : "画面 + 声音",
			format: ext.slice(1).toUpperCase(),
			filename: multiple ? `${base}_分段${i + 1}${ext}` : `${base}${ext}`,
			segments: [{
				url: seg.url,
				backups: seg.backup_url ?? [],
				size: seg.size
			}],
			size: seg.size,
			recommended: !multiple
		};
	});
}
var CODEC_BY_PREFIX = [
	["avc", "AVC"],
	["hev", "HEVC"],
	["hvc", "HEVC"],
	["av01", "AV1"]
];
var CODEC_BY_ID = {
	7: "AVC",
	12: "HEVC",
	13: "AV1"
};
function codecLabel(stream) {
	const codecs = stream.codecs?.toLowerCase() ?? "";
	const byPrefix = CODEC_BY_PREFIX.find(([prefix]) => codecs.startsWith(prefix));
	if (byPrefix) return byPrefix[1];
	return stream.codecid !== void 0 ? CODEC_BY_ID[stream.codecid] : void 0;
}
/** Short facts about the selected streams, shown as chips under the title. */
function describeStreams(info) {
	if (info.code !== ErrorCode.OK) return [];
	const facts = [];
	const video = info.dash?.video;
	if (video?.width && video.height) facts.push(`${video.width}×${video.height}`);
	const codec = video ? codecLabel(video) : void 0;
	if (codec) facts.push(codec);
	if (!info.dash && info.durl?.length) facts.push(safeExtension(info.durl[0].url, ".flv").slice(1).toUpperCase());
	return facts;
}
//#endregion
//#region src/lib/popup/styles.ts
/**
* Styles for the download popup's shadow root. Colors read Bilibili's own CSS
* custom properties (they inherit through the shadow boundary), so the popup
* follows the site's light and dark themes; the fallbacks are the light values.
*/
var POPUP_STYLES = `
:host {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100000;
	font-size: 13px;
	line-height: 1.5;
	color: var(--fg1);
	text-align: left;
	letter-spacing: normal;
	--pink: var(--brand_pink, #ff6699);
	--blue: var(--brand_blue, #00aeec);
	--green: #20b26c;
	--red: #f85a54;
	--surface: var(--bg1_float, var(--bg1, #ffffff));
	--muted: var(--graph_bg_regular, #f1f2f3);
	--hover: var(--graph_bg_thin, #f6f7f8);
	--line: var(--line_regular, #e3e5e7);
	/* Separate local names: a property that references itself is a cycle and both values drop. */
	--fg1: var(--text1, #18191c);
	--fg2: var(--text2, #61666d);
	--fg3: var(--text3, #9499a0);
}
* { box-sizing: border-box; }
svg { width: 16px; height: 16px; display: block; flex: none; }
button { font: inherit; color: inherit; }

.panel {
	width: 372px;
	max-width: calc(100vw - 16px);
	display: flex;
	flex-direction: column;
	background: var(--surface);
	border: 1px solid var(--line);
	border-radius: 12px;
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
	overflow: hidden;
	animation: pop-in 140ms ease-out;
}
@keyframes pop-in { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }

.head { display: flex; align-items: flex-start; gap: 8px; padding: 14px 10px 12px 16px; }
.heading { flex: 1; min-width: 0; }
.eyebrow { display: flex; align-items: center; gap: 4px; margin: 0 0 4px; font-size: 12px; color: var(--fg3); }
.eyebrow svg { width: 14px; height: 14px; color: var(--pink); }
.title {
	margin: 0;
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	word-break: break-word;
}
.chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.chip {
	font-size: 11px;
	line-height: 18px;
	padding: 0 6px;
	border-radius: 4px;
	background: var(--muted);
	color: var(--fg2);
	font-variant-numeric: tabular-nums;
}
.chip.quality { background: rgba(255, 102, 153, 0.12); color: var(--pink); font-weight: 600; }

.icon-btn {
	flex: none;
	width: 28px;
	height: 28px;
	display: grid;
	place-items: center;
	padding: 0;
	border: 0;
	border-radius: 6px;
	background: transparent;
	color: var(--fg3);
	cursor: pointer;
}
.icon-btn:hover { background: var(--muted); color: var(--fg1); }
.icon-btn.copied { color: var(--green); }
.icon-btn:focus-visible, .btn:focus-visible, .text-btn:focus-visible {
	outline: 2px solid var(--blue);
	outline-offset: 1px;
}

/* The option list keeps its space; when the panel is height-capped the log panel shrinks first. */
.body { flex: 0 1 auto; min-height: 0; overflow-y: auto; border-top: 1px solid var(--line); }
.options { list-style: none; margin: 0; padding: 6px; }
.row { display: flex; align-items: center; gap: 12px; margin: 0; padding: 10px; border-radius: 8px; }
.row:hover { background: var(--hover); }
.tile {
	flex: none;
	width: 36px;
	height: 36px;
	display: grid;
	place-items: center;
	border-radius: 8px;
	background: var(--muted);
	color: var(--fg2);
}
.tile svg { width: 18px; height: 18px; }
.row[data-recommended] .tile { background: rgba(255, 102, 153, 0.12); color: var(--pink); }
.row[data-status='done'] .tile { background: rgba(32, 178, 108, 0.12); color: var(--green); }
.row[data-status='error'] .tile { background: rgba(248, 90, 84, 0.12); color: var(--red); }
.main { flex: 1; min-width: 0; }
.line1 { display: flex; align-items: center; gap: 6px; font-weight: 500; }
.badge {
	font-size: 10px;
	line-height: 16px;
	padding: 0 5px;
	border-radius: 4px;
	background: var(--pink);
	color: #fff;
}
.percent { margin-left: auto; font-size: 12px; color: var(--fg2); font-variant-numeric: tabular-nums; }
.line2 {
	font-size: 12px;
	color: var(--fg3);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-variant-numeric: tabular-nums;
}
.row[data-status='done'] .line2 { color: var(--green); }
.row[data-status='error'] .line2 { color: var(--red); white-space: normal; word-break: break-word; }
.bar { height: 4px; margin: 6px 0 4px; border-radius: 2px; background: var(--muted); overflow: hidden; }
.bar > span { display: block; height: 100%; border-radius: inherit; background: var(--pink); transition: width 200ms linear; }
.bar.indeterminate > span { width: 40%; animation: slide 1.1s ease-in-out infinite; }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
.actions { flex: none; display: flex; align-items: center; gap: 2px; }

.btn {
	height: 30px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 0 12px;
	border: 1px solid var(--line);
	border-radius: 6px;
	background: transparent;
	color: var(--fg1);
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	text-decoration: none;
	cursor: pointer;
}
.btn svg { width: 14px; height: 14px; }
.btn:hover { border-color: var(--pink); color: var(--pink); }
.btn.primary { border-color: var(--pink); background: var(--pink); color: #fff; }
.btn.primary:hover { filter: brightness(1.08); color: #fff; }

.state { padding: 32px 24px; text-align: center; color: var(--fg3); }
.state svg { width: 28px; height: 28px; margin: 0 auto 10px; }
.state.error svg { color: var(--red); }
.state strong { display: block; margin-bottom: 4px; color: var(--fg1); font-weight: 500; }
.spinner {
	width: 22px;
	height: 22px;
	margin: 0 auto 12px;
	border: 2px solid var(--muted);
	border-top-color: var(--pink);
	border-radius: 50%;
	animation: spin 800ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.head, .foot { flex: none; }
.foot {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 10px 8px 16px;
	border-top: 1px solid var(--line);
	font-size: 12px;
	color: var(--fg3);
}
.hint { flex: 1; min-width: 0; display: flex; align-items: center; gap: 4px; }
.hint svg, .text-btn svg { width: 14px; height: 14px; }
.text-btn {
	display: inline-flex;
	align-items: center;
	gap: 2px;
	padding: 2px 6px;
	border: 0;
	border-radius: 4px;
	background: none;
	color: var(--fg3);
	font-size: 12px;
	cursor: pointer;
}
.text-btn:hover { color: var(--blue); background: var(--muted); }
.text-btn[aria-expanded='true'] svg { transform: rotate(180deg); }
.count { font-variant-numeric: tabular-nums; }

.logs {
	flex: 0 1000 auto;
	min-height: 64px;
	display: flex;
	flex-direction: column;
	border-top: 1px solid var(--line);
	background: var(--hover);
}
.logs-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px 0 16px; font-size: 12px; color: var(--fg3); }
.log-lines {
	flex: 0 1 auto;
	min-height: 0;
	margin: 0;
	padding: 4px 16px 10px;
	max-height: 160px;
	overflow: auto;
	font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	color: var(--fg2);
	white-space: pre-wrap;
	word-break: break-all;
}
.log-lines:empty::before { content: '暂无日志'; color: var(--fg3); }

@media (prefers-reduced-motion: reduce) {
	.panel, .bar > span, .bar.indeterminate > span, .spinner { animation: none; transition: none; }
}
`;
//#endregion
//#region src/lib/popup/icons.ts
/** Inline SVG icons (Lucide-style strokes, 24px grid) for the download popup. */
var svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
var ICONS = {
	download: svg("<path d=\"M12 4v11\"/><path d=\"m7 10 5 5 5-5\"/><path d=\"M5 20h14\"/>"),
	film: svg("<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M10 9.2v5.6a.5.5 0 0 0 .76.43l4.5-2.8a.5.5 0 0 0 0-.86l-4.5-2.8a.5.5 0 0 0-.76.43z\" fill=\"currentColor\"/>"),
	image: svg("<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"m3 16 5-5 4 4 3-3 6 6\"/>"),
	music: svg("<path d=\"M9 18V6l11-2v12\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"17\" cy=\"16\" r=\"3\"/>"),
	check: svg("<path d=\"m5 12.5 4.5 4.5L19 7.5\"/>"),
	alert: svg("<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7.5v5\"/><path d=\"M12 16.5h.01\"/>"),
	close: svg("<path d=\"M6 6l12 12\"/><path d=\"M18 6 6 18\"/>"),
	link: svg("<path d=\"M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1\"/><path d=\"M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1\"/>"),
	retry: svg("<path d=\"M20 12a8 8 0 1 1-2.34-5.66L20 8.5\"/><path d=\"M20 3.5v5h-5\"/>"),
	info: svg("<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v5\"/><path d=\"M12 7.5h.01\"/>"),
	chevron: svg("<path d=\"m6 9 6 6 6-6\"/>"),
	copy: svg("<rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"/><path d=\"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2\"/>")
};
//#endregion
//#region src/lib/popup/view.ts
/**
* DOM builders for the download popup. Every function returns fresh nodes built
* with createElement/textContent, so titles and URLs never pass through HTML
* parsing. Interactive elements carry `data-action` (and `data-id` for rows);
* the controller handles them by event delegation.
*/
function h(tag, attrs = {}, ...children) {
	const el = document.createElement(tag);
	for (const [name, value] of Object.entries(attrs)) {
		if (value === void 0 || value === false) continue;
		el.setAttribute(name, value === true ? "" : value);
	}
	for (const child of children) {
		if (child === null || child === void 0 || child === false) continue;
		el.append(child);
	}
	return el;
}
function icon(name) {
	const wrap = document.createElement("span");
	wrap.style.display = "contents";
	wrap.innerHTML = ICONS[name];
	return wrap;
}
function joinFacts(facts) {
	return facts.filter(Boolean).join(" · ");
}
function knownSize(bytes) {
	return bytes ? formatSize(bytes) : void 0;
}
function headerTitle(info) {
	if (!info) return "正在获取视频信息";
	if (info.title) return info.title;
	return info.code === ErrorCode.OK ? "未命名视频" : "无法获取下载地址";
}
function renderHeader(info) {
	const chips = info ? [info.quality, ...describeStreams(info)].filter((c) => !!c) : [];
	return h("div", { class: "head" }, h("div", { class: "heading" }, h("p", { class: "eyebrow" }, icon("download"), "下载视频"), h("h2", {
		class: "title",
		id: "bh-title",
		title: info?.title
	}, headerTitle(info)), chips.length > 0 && h("div", { class: "chips" }, ...chips.map((c, i) => h("span", { class: i === 0 && info?.quality ? "chip quality" : "chip" }, c)))), h("button", {
		class: "icon-btn",
		type: "button",
		"data-action": "close",
		title: "关闭",
		"aria-label": "关闭"
	}, icon("close")));
}
var KIND_ICON = {
	merged: "film",
	file: "film",
	video: "image",
	audio: "music"
};
function formatSpeed(received, startedAt, now) {
	const seconds = (now - startedAt) / 1e3;
	if (seconds < 1 || received <= 0) return void 0;
	return `${formatSize(received / seconds)}/s`;
}
function renderRow(option, state, now, index) {
	const status = state?.status ?? "idle";
	const tileIcon = status === "done" ? "check" : status === "error" ? "alert" : KIND_ICON[option.kind];
	const labelId = `bh-option-${index}`;
	let percent;
	let line2;
	let bar = null;
	const actions = [];
	switch (state?.status) {
		case "downloading": {
			const pct = state.total > 0 ? Math.min(100, Math.floor(state.received / state.total * 100)) : null;
			percent = pct === null ? void 0 : `${pct}%`;
			line2 = joinFacts([state.received <= 0 ? "正在连接…" : state.total > 0 ? `${formatSize(state.received)} / ${formatSize(state.total)}` : formatSize(state.received), formatSpeed(state.received, state.startedAt, now)]);
			bar = h("div", {
				class: pct === null ? "bar indeterminate" : "bar",
				role: "progressbar",
				"aria-labelledby": labelId,
				"aria-valuemin": "0",
				"aria-valuemax": "100",
				"aria-valuenow": pct === null ? void 0 : String(pct)
			}, h("span", { style: pct === null ? void 0 : `width:${pct}%` }));
			break;
		}
		case "merging":
			line2 = "正在合并画面与声音…";
			bar = h("div", {
				class: "bar indeterminate",
				role: "progressbar",
				"aria-labelledby": labelId
			}, h("span"));
			break;
		case "done":
			line2 = joinFacts([
				"已保存",
				option.format,
				knownSize(state.size)
			]);
			actions.push(h("a", {
				class: "btn",
				href: state.url,
				download: option.filename,
				title: option.filename
			}, "再次保存"));
			break;
		case "error":
			line2 = `下载失败：${state.message}`;
			actions.push(h("button", {
				class: "btn",
				type: "button",
				"data-action": "download",
				"data-id": option.id
			}, icon("retry"), "重试"));
			break;
		default:
			line2 = joinFacts([
				option.format,
				option.detail,
				knownSize(option.size)
			]);
			if (option.kind !== "merged") actions.push(h("button", {
				class: "icon-btn",
				type: "button",
				"data-action": "copy",
				"data-id": option.id,
				title: "复制直链",
				"aria-label": `复制${option.label}直链`
			}, icon("link")));
			actions.push(h("button", {
				class: option.recommended ? "btn primary" : "btn",
				type: "button",
				"data-action": "download",
				"data-id": option.id,
				"aria-label": `下载${option.label}`
			}, icon("download"), "下载"));
	}
	return h("li", {
		class: "row",
		"data-row": option.id,
		"data-status": status,
		"data-recommended": option.recommended
	}, h("span", { class: "tile" }, icon(tileIcon)), h("div", { class: "main" }, h("div", { class: "line1" }, h("span", { id: labelId }, option.label), option.recommended && status === "idle" && h("span", { class: "badge" }, "推荐"), percent && h("span", { class: "percent" }, percent)), bar, h("div", {
		class: "line2",
		title: line2
	}, line2)), actions.length > 0 && h("div", { class: "actions" }, ...actions));
}
function renderBody(info, rows) {
	if (!info) return h("div", { class: "body" }, h("div", {
		class: "state",
		role: "status"
	}, h("div", { class: "spinner" }), "正在解析视频地址…"));
	if (info.code !== ErrorCode.OK || rows.length === 0) return h("div", { class: "body" }, h("div", {
		class: "state error",
		role: "alert"
	}, icon("alert"), h("strong", {}, info.message || "没有找到可下载的视频流"), "可以尝试刷新页面、登录账号，或在播放器中切换清晰度后重试"));
	return h("div", { class: "body" }, h("ul", {
		class: "options",
		"aria-label": "下载选项"
	}, ...rows));
}
function renderFooter(logCount, logsOpen) {
	return h("div", { class: "foot" }, h("span", { class: "hint" }, icon("info"), "清晰度跟随播放器，切换后自动更新"), h("button", {
		class: "text-btn",
		type: "button",
		"data-action": "toggle-logs",
		"aria-expanded": String(logsOpen),
		"aria-controls": "bh-logs"
	}, "日志", h("span", { class: "count" }, logCount > 0 ? ` ${logCount}` : ""), icon("chevron")));
}
function renderLogs(lines) {
	return h("div", {
		class: "logs",
		id: "bh-logs"
	}, h("div", { class: "logs-head" }, h("span", {}, "运行日志"), h("button", {
		class: "text-btn",
		type: "button",
		"data-action": "copy-logs"
	}, icon("copy"), "复制")), h("pre", { class: "log-lines" }, lines.join("\n")));
}
//#endregion
//#region src/lib/popup/popup.ts
/**
* Download popup controller. Owns the shadow-DOM panel anchored to the toolbar
* button: renders the current download options, patches single rows as task
* progress arrives, keeps a bounded log buffer, and handles dismissal.
*/
var POPUP_HOST_ID = "bilibili-helper-popup";
var MAX_LOG_LINES = 300;
var VIEWPORT_PADDING = 8;
var COPIED_FEEDBACK_MS = 1500;
var schedule$1 = typeof requestAnimationFrame === "function" ? (cb) => requestAnimationFrame(cb) : (cb) => setTimeout(cb, 16);
var DownloadPopup = class {
	tasks;
	now;
	onToggle;
	info = null;
	options = [];
	logs = [];
	logsOpen = false;
	host = null;
	panel = null;
	anchor = null;
	placement = "bottom-start";
	stopAutoUpdate = null;
	rowEls = /* @__PURE__ */ new Map();
	dirtyRows = /* @__PURE__ */ new Set();
	frameQueued = false;
	focusOnReveal = false;
	unsubscribe;
	constructor(tasks, now = () => Date.now(), onToggle = () => {}) {
		this.tasks = tasks;
		this.now = now;
		this.onToggle = onToggle;
		this.unsubscribe = tasks.subscribe((id) => this.queueRow(id));
	}
	isOpen() {
		return this.host !== null;
	}
	setInfo(info) {
		this.info = info;
		this.options = info ? buildDownloadOptions(info) : [];
		this.tasks.retain(new Set(this.options.map((o) => o.id)));
		this.render();
	}
	toggle(anchor, placement) {
		if (this.isOpen()) this.close();
		else this.open(anchor, placement);
	}
	open(anchor, placement) {
		if (this.isOpen()) this.close();
		this.anchor = anchor;
		this.placement = placement;
		const host = document.createElement("div");
		host.id = POPUP_HOST_ID;
		host.style.visibility = "hidden";
		const root = host.attachShadow({ mode: "open" });
		const style = document.createElement("style");
		style.textContent = POPUP_STYLES;
		this.panel = document.createElement("div");
		this.panel.className = "panel";
		this.panel.setAttribute("role", "dialog");
		this.panel.setAttribute("aria-labelledby", "bh-title");
		root.append(style, this.panel);
		root.addEventListener("click", this.onClick);
		document.body.appendChild(host);
		this.host = host;
		document.addEventListener("pointerdown", this.onPointerDown, true);
		document.addEventListener("keydown", this.onKeyDown, true);
		this.stopAutoUpdate = autoUpdate(anchor, host, () => this.position());
		this.focusOnReveal = true;
		this.render();
		this.onToggle(true);
	}
	close() {
		if (!this.host) return;
		this.stopAutoUpdate?.();
		this.stopAutoUpdate = null;
		document.removeEventListener("pointerdown", this.onPointerDown, true);
		document.removeEventListener("keydown", this.onKeyDown, true);
		this.host.remove();
		this.host = null;
		this.panel = null;
		this.rowEls.clear();
		this.onToggle(false);
	}
	appendLog(line) {
		this.logs.push(line);
		if (this.logs.length > MAX_LOG_LINES) this.logs.splice(0, this.logs.length - MAX_LOG_LINES);
		this.renderLogState();
	}
	clearLogs() {
		this.logs.length = 0;
		this.renderLogState();
	}
	destroy() {
		this.close();
		this.unsubscribe();
	}
	optionById(id) {
		return id === void 0 ? void 0 : this.options.find((o) => o.id === id);
	}
	render() {
		if (!this.panel) return;
		this.rowEls.clear();
		const rows = this.options.map((option, index) => {
			const row = renderRow(option, this.tasks.get(option.id), this.now(), index);
			this.rowEls.set(option.id, row);
			return row;
		});
		this.panel.replaceChildren(renderHeader(this.info), renderBody(this.info, rows), renderFooter(this.logs.length, this.logsOpen), this.logsOpen ? renderLogs(this.logs) : "");
	}
	renderLogState() {
		if (!this.panel) return;
		const count = this.panel.querySelector(".foot .count");
		if (count) count.textContent = this.logs.length > 0 ? ` ${this.logs.length}` : "";
		const lines = this.panel.querySelector(".log-lines");
		if (!lines) return;
		const pinned = lines.scrollHeight - lines.scrollTop - lines.clientHeight < 24;
		lines.textContent = this.logs.join("\n");
		if (pinned) lines.scrollTop = lines.scrollHeight;
	}
	queueRow(id) {
		if (!this.panel || !this.rowEls.has(id)) return;
		this.dirtyRows.add(id);
		if (this.frameQueued) return;
		this.frameQueued = true;
		schedule$1(() => {
			this.frameQueued = false;
			for (const dirty of this.dirtyRows) this.patchRow(dirty);
			this.dirtyRows.clear();
		});
	}
	patchRow(id) {
		const current = this.rowEls.get(id);
		const index = this.options.findIndex((o) => o.id === id);
		if (!current || index < 0) return;
		const focusedAction = (this.host?.shadowRoot?.activeElement)?.closest("[data-row]") === current;
		const next = renderRow(this.options[index], this.tasks.get(id), this.now(), index);
		current.replaceWith(next);
		this.rowEls.set(id, next);
		if (focusedAction) next.querySelector("button, a")?.focus({ preventScroll: true });
	}
	position() {
		const host = this.host;
		const anchor = this.anchor;
		if (!host || !anchor) return;
		computePosition(anchor, host, {
			strategy: "fixed",
			placement: this.placement,
			middleware: [
				offset(8),
				flip({ padding: VIEWPORT_PADDING }),
				shift({ padding: VIEWPORT_PADDING }),
				size({
					padding: VIEWPORT_PADDING,
					apply: ({ availableHeight }) => {
						if (this.panel) this.panel.style.maxHeight = `${Math.max(220, availableHeight)}px`;
					}
				})
			]
		}).then(({ x, y }) => {
			if (this.host !== host) return;
			host.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
			host.style.visibility = "";
			if (this.focusOnReveal) {
				this.focusOnReveal = false;
				this.panel?.querySelector("[data-action=\"download\"]")?.focus({ preventScroll: true });
			}
		});
	}
	onClick = (event) => {
		const target = event.target?.closest("[data-action]");
		if (!target) return;
		const action = target.dataset.action;
		const option = this.optionById(target.dataset.id);
		switch (action) {
			case "close":
				this.close();
				this.anchor?.focus({ preventScroll: true });
				break;
			case "download":
				if (option) this.tasks.start(option);
				break;
			case "copy":
				if (option) this.copy(option.segments[0].url, target, "已复制直链");
				break;
			case "copy-logs":
				this.copy(this.logs.join("\n"), target, "已复制日志");
				break;
			case "toggle-logs":
				this.logsOpen = !this.logsOpen;
				this.render();
				this.panel?.querySelector("[data-action=\"toggle-logs\"]")?.focus({ preventScroll: true });
				if (this.logsOpen) this.renderLogState();
				break;
		}
	};
	copy(text, button, done) {
		const clipboard = navigator.clipboard;
		if (!clipboard) {
			this.appendLog("复制失败：当前页面无法访问剪贴板");
			return;
		}
		clipboard.writeText(text).then(() => {
			const original = [...button.childNodes];
			const title = button.title;
			button.classList.add("copied");
			button.title = done;
			button.replaceChildren(icon("check"));
			setTimeout(() => {
				button.classList.remove("copied");
				button.title = title;
				button.replaceChildren(...original);
			}, COPIED_FEEDBACK_MS);
		}, (err) => this.appendLog(`复制失败：${err instanceof Error ? err.message : String(err)}`));
	}
	onPointerDown = (event) => {
		const path = event.composedPath();
		if (this.host && path.includes(this.host)) return;
		if (this.anchor && path.includes(this.anchor)) return;
		this.close();
	};
	onKeyDown = (event) => {
		if (event.key !== "Escape") return;
		event.stopPropagation();
		this.close();
		this.anchor?.focus({ preventScroll: true });
	};
};
//#endregion
//#region src/lib/host.ts
var MODULE$3 = "host";
var DOWNLOAD_BTN_ID = "bilibili-helper-download-btn";
var IDLE_LABEL = "下载";
var tasks = null;
var popup = null;
var btnEl = null;
var btnLabel = null;
var placement = "bottom-start";
var observer = null;
var restoreQueued = false;
var schedule = typeof requestAnimationFrame === "function" ? (cb) => requestAnimationFrame(cb) : (cb) => setTimeout(cb, 16);
function controller() {
	if (popup) return popup;
	tasks = new DownloadTasks({
		downloadStream: (segment, onProgress) => downloadStream(segment, onProgress),
		downloadAndMerge: (segments, onProgress, onMerging) => downloadAndMerge(segments, onProgress, onMerging),
		saveBlob,
		revokeUrl: (url) => URL.revokeObjectURL(url),
		now: () => Date.now(),
		log: (line) => popup?.appendLog(line)
	});
	tasks.subscribe(updateButtonLabel);
	popup = new DownloadPopup(tasks, void 0, (open) => btnEl?.setAttribute("aria-expanded", String(open)));
	return popup;
}
function updateButtonLabel() {
	if (!btnLabel || !tasks) return;
	const { active, percent } = tasks.summary();
	const label = active === 0 ? IDLE_LABEL : percent === null ? "处理中" : `${percent}%`;
	if (btnLabel.textContent !== label) btnLabel.textContent = label;
	btnEl?.toggleAttribute("data-busy", active > 0);
}
/** Remove the floating bottom bar left behind by older versions. */
function cleanupOldHost() {
	const old = document.getElementById("bilibili-helper-host");
	if (old) {
		old.remove();
		logInfo(MODULE$3, "removed old floating host bar");
	}
}
function onButtonActivate(event) {
	if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
	event.preventDefault();
	if (btnEl) controller().toggle(btnEl, placement);
}
function decorate(el) {
	el.id = DOWNLOAD_BTN_ID;
	el.setAttribute("role", "button");
	el.setAttribute("tabindex", "0");
	el.setAttribute("aria-haspopup", "dialog");
	el.setAttribute("aria-expanded", "false");
	el.title = "下载当前视频";
	el.addEventListener("click", onButtonActivate);
	el.addEventListener("keydown", onButtonActivate);
}
function createFloatingButton() {
	const el = document.createElement("div");
	el.style.cssText = [
		"position:fixed",
		"right:24px",
		"bottom:24px",
		"z-index:99999",
		"display:flex",
		"align-items:center",
		"gap:6px",
		"height:40px",
		"padding:0 16px",
		"border-radius:20px",
		"background:var(--brand_pink,#ff6699)",
		"color:#fff",
		"font-size:14px",
		"font-weight:500",
		"cursor:pointer",
		"box-shadow:0 6px 16px rgba(255,102,153,.35)",
		"user-select:none"
	].join(";");
	el.innerHTML = `<span style="display:block;width:18px;height:18px">${ICONS.download}</span><span data-label></span>`;
	return el;
}
function createToolbarButton() {
	const el = document.createElement("div");
	el.className = "toolbar-left-item-wrap";
	el.style.cssText = "display:inline-flex;align-items:center;cursor:pointer;";
	el.innerHTML = `
		<div class="video-toolbar-left-item" style="display:flex;align-items:center;gap:6px;color:var(--text2,#61666d);font-size:13px">
			<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="video-toolbar-item-icon" fill="currentColor" aria-hidden="true">
				<path d="M23 17v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5h2v5h14v-5h2z"/>
				<path d="M14 4a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L13 14.586V5a1 1 0 0 1 1-1z"/>
			</svg>
			<span data-label style="font-variant-numeric:tabular-nums"></span>
		</div>
	`;
	return el;
}
function findShareItem() {
	return document.querySelector(".toolbar-left-item-wrap .video-share-wrap")?.closest(".toolbar-left-item-wrap") ?? null;
}
/** The button was dropped by a re-render, or is floating while a toolbar now exists. */
function buttonNeedsRestore() {
	if (!btnEl) return false;
	if (!btnEl.isConnected) return true;
	return placement === "top-end" && findShareItem() !== null;
}
function restoreButton() {
	restoreQueued = false;
	if (!buttonNeedsRestore()) return;
	logInfo(MODULE$3, "download button missing or misplaced, restoring");
	ensureButton();
}
/**
* Bilibili's SPA can re-render the toolbar without a URL or quality change,
* so the button is restored on DOM changes rather than on new video data.
*/
function watchButton() {
	if (observer || typeof MutationObserver !== "function") return;
	observer = new MutationObserver(() => {
		if (restoreQueued || !buttonNeedsRestore()) return;
		restoreQueued = true;
		schedule(restoreButton);
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}
/** Inject the download button, or move it back into a re-rendered toolbar. */
function ensureButton() {
	if (btnEl && !buttonNeedsRestore()) return btnEl;
	btnEl?.remove();
	cleanupOldHost();
	const shareItem = findShareItem();
	if (shareItem?.parentNode) {
		btnEl = createToolbarButton();
		placement = "bottom-start";
		shareItem.parentNode.insertBefore(btnEl, shareItem.nextSibling);
		logInfo(MODULE$3, "download button injected after share button");
	} else {
		logWarn(MODULE$3, "share button not found, using floating download button");
		btnEl = createFloatingButton();
		placement = "top-end";
		document.body.appendChild(btnEl);
	}
	btnLabel = btnEl.querySelector("[data-label]");
	decorate(btnEl);
	const popupController = controller();
	updateButtonLabel();
	if (popupController.isOpen()) popupController.open(btnEl, placement);
	watchButton();
	return btnEl;
}
/**
* Show or update the download info. `loading` clears the current info so an
* open popup shows its loading state until the real data arrives.
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
	controller().setInfo(loading ? null : info);
	if (!loading) ensureButton();
}
/** Log to the console and to the popup's log panel. */
function log(...args) {
	console.log("[bilibili downloader]", "[host]", ...args);
	controller().appendLog(args.map((a) => typeof a === "object" ? safeJson(a) : String(a)).join(" "));
}
function safeJson(a) {
	try {
		return JSON.stringify(a);
	} catch {
		return String(a);
	}
}
function clearLogs() {
	logInfo(MODULE$3, "logs cleared");
	popup?.clearLogs();
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
/**
* Try to extract WBI keys from window.__INITIAL_STATE__ (embedded in the page HTML).
* This serves as a fallback when the nav API is unavailable (e.g. logged-out users
* who get -101 from /x/web-interface/nav).
*/
function tryExtractKeysFromPage() {
	try {
		const pageState = (typeof window !== "undefined" ? window : null)?.__INITIAL_STATE__;
		if (!pageState) {
			logInfo(MODULE$2, "tryExtractKeysFromPage: no __INITIAL_STATE__ in window");
			return null;
		}
		const wbiImg = pageState.wbi_img;
		if (!wbiImg) {
			logInfo(MODULE$2, "tryExtractKeysFromPage: no wbi_img in __INITIAL_STATE__");
			return null;
		}
		const keys = extractKeysFromNav({ wbi_img: wbiImg });
		if (keys) logInfo(MODULE$2, "WBI keys extracted from __INITIAL_STATE__", {
			imgKey: keys.imgKey.slice(0, 8) + "...",
			subKey: keys.subKey.slice(0, 8) + "..."
		});
		return keys;
	} catch (err) {
		logWarn(MODULE$2, "tryExtractKeysFromPage: error", err);
		return null;
	}
}
/** Fetch and cache the WBI keys from the nav API, with a fallback to page state. */
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
	try {
		const json = await (await window.fetch(NAV_API, FETCH_DEFAULTS)).json();
		if (json.code !== 0) {
			logWarn(MODULE$2, "nav API returned non-zero code, trying page fallback", json.code);
			const fallback = tryExtractKeysFromPage();
			if (fallback) {
				cachedKeys = {
					...fallback,
					fetchedAt: Date.now()
				};
				return fallback;
			}
			throw new Error(`nav API returned code ${json.code} and no page fallback available`);
		}
		const keys = extractKeysFromNav(json.data ?? {});
		if (!keys) {
			logWarn(MODULE$2, "failed to extract WBI keys from nav response, trying page fallback", json.data);
			const fallback = tryExtractKeysFromPage();
			if (fallback) {
				cachedKeys = {
					...fallback,
					fetchedAt: Date.now()
				};
				return fallback;
			}
			throw new Error("failed to extract WBI keys from nav response and no page fallback available");
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
	} catch (err) {
		if (err instanceof TypeError || err instanceof Error && err.message.includes("fetch")) {
			logWarn(MODULE$2, "nav API fetch failed (network error), trying page fallback", err);
			const fallback = tryExtractKeysFromPage();
			if (fallback) {
				cachedKeys = {
					...fallback,
					fetchedAt: Date.now()
				};
				return fallback;
			}
		}
		throw err;
	}
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
	const parsedDash = DashDataSchema.safeParse(dash);
	if (!parsedDash.success) {
		logWarn(MODULE$1, "buildDashResult: invalid DASH data");
		return {
			code: ErrorCode.INVALID_RESPONSE,
			message: "该视频暂时不支持下载"
		};
	}
	const { audio, video: videos } = parsedDash.data;
	const video = videos.find((v) => `${v.codecid ?? ""}` === `${codecid}` && `${v.id}` === `${quality}`) ?? videos[0];
	const audioStream = audio[0];
	if (!audioStream || !video) {
		logWarn(MODULE$1, "buildDashResult: no matching audio/video", {
			quality,
			codecid,
			audioCount: audio.length,
			videoCount: videos.length,
			videoIds: videos.map((v) => v.id)
		});
		return {
			code: ErrorCode.INVALID_RESPONSE,
			message: "该视频暂时不支持下载"
		};
	}
	logInfo(MODULE$1, "buildDashResult: matched", {
		videoId: video.id,
		videoCodecid: video.codecid,
		audioId: audioStream.id,
		qualityLabel: QUALITY_LABELS[video.id] ?? ""
	});
	return {
		code: ErrorCode.OK,
		dash: {
			audio: normalizeStream(audioStream),
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
window.addEventListener("error", (event) => {
	if (!event.filename.includes("bilibili-helper-content-script")) return;
	dispatchContentScriptError(event.error ?? event.message, "runtime");
});
window.addEventListener("unhandledrejection", (event) => {
	if (!(event.reason instanceof Error ? event.reason.stack ?? "" : "").includes("bilibili-helper-content-script")) return;
	dispatchContentScriptError(event.reason, "runtime");
});
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
		const pageState = window.__INITIAL_STATE__;
		if (pageState && pageState.videoData) {
			logInfo(MODULE, "using __INITIAL_STATE__ from window");
			return {
				code: 0,
				data: pageState
			};
		}
		const playinfo = window.__playinfo__;
		if (playinfo?.data) {
			logInfo(MODULE, "using __playinfo__ from window");
			return {
				code: 0,
				data: playinfo.data
			};
		}
		const hydrateData = window.__PLAYURL_HYDRATE_DATA__;
		if (hydrateData) {
			logInfo(MODULE, "using __PLAYURL_HYDRATE_DATA__ from window");
			return {
				code: 0,
				data: hydrateData
			};
		}
		const html = await (await window.fetch(window.location.href, FETCH_DEFAULTS)).text();
		logInfo(MODULE, "page HTML fetched", { length: html.length });
		const playinfoMatch = html.match(/window\.__playinfo__\s*=\s*(\{[\s\S]+?\});/);
		if (playinfoMatch) try {
			const parsed = JSON.parse(playinfoMatch[1]);
			if (parsed?.data) {
				logInfo(MODULE, "found __playinfo__ in HTML");
				return {
					code: 0,
					data: parsed.data
				};
			}
		} catch {
			logWarn(MODULE, "__playinfo__ JSON parse failed in HTML");
		}
		const initMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]+?\});/);
		if (initMatch) try {
			const parsed = JSON.parse(initMatch[1]);
			logInfo(MODULE, "found __INITIAL_STATE__ in HTML");
			return {
				code: 0,
				data: parsed
			};
		} catch {
			logWarn(MODULE, "__INITIAL_STATE__ JSON parse failed in HTML");
		}
		const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/);
		if (nextDataMatch) try {
			const state = JSON.parse(nextDataMatch[1]).props?.pageProps?.dehydratedState?.queries?.[0]?.state;
			if (state) {
				logInfo(MODULE, "found __NEXT_DATA__", { status: state.status });
				return {
					code: state.status === "success" ? 0 : -1,
					data: state
				};
			}
		} catch {
			logWarn(MODULE, "__NEXT_DATA__ parse failed");
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
	let playResult = null;
	try {
		const playinfo = window.__playinfo__;
		if (playinfo?.data && (playinfo.data.dash || playinfo.data.durl)) {
			logInfo(MODULE, "using __playinfo__ from page context");
			playResult = processPlayUrlResult(playinfo.data, quality);
		} else logInfo(MODULE, "__playinfo__ not available on page");
	} catch (err) {
		logWarn(MODULE, "__playinfo__ parse failed", err);
	}
	if (!playResult || playResult.code !== ErrorCode.OK) {
		logInfo(MODULE, "falling back to WBI API fetch");
		playResult = await fetchUgcPlayUrl(avid, bvid, cid, quality);
	}
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
	let lastUrl = window.location.href;
	timer.interval = window.setInterval(() => {
		const currentUrl = window.location.href;
		if (currentUrl !== lastUrl) {
			logInfo(MODULE, "URL change detected", {
				from: lastUrl,
				to: currentUrl
			});
			lastUrl = currentUrl;
			clearLogs();
			window.setTimeout(onChange, 0);
		}
	}, 1e3);
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
