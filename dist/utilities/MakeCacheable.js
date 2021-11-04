"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCacheable = void 0;
var uuid_1 = require("uuid");
var CacheController_1 = require("./CacheController");
var Storage = __importStar(require("./CacheStorage"));
function makeCacheable(fn, options) {
    // declarations and configuration
    var keepAlive = (options === null || options === void 0 ? void 0 : options.keepAlive) || Infinity; // Do not remove the return value from cache
    var cacheController = (options === null || options === void 0 ? void 0 : options.cacheController) || CacheController_1.CacheController.default;
    var isUnlinked = false;
    var cachedAt = null;
    var cacheIdentifier = (options === null || options === void 0 ? void 0 : options.key) || (0, uuid_1.v4)();
    // register the key, can throw an error
    Storage.registerKey(cacheIdentifier);
    var canBeInvoked = function () { return cachedValue() === null || cachedAt === null || cachedAt + keepAlive <= Date.now(); };
    var isCacheControllerDefined = function () { return cacheController !== null && !isUnlinked; };
    var cache = function (value, onRecord) {
        if (onRecord === void 0) { onRecord = true; }
        if (onRecord)
            setCachedAt(Date.now());
        Storage.setItem(cacheIdentifier, value);
        if (isCacheControllerDefined())
            cacheController.emit("cacheUpdate", { key: cacheIdentifier, value: value, timestamp: cachedAt });
    };
    var setCachedAt = function (value) {
        cachedAt = value;
    };
    var cachedValue = function () {
        return Storage.getItem(cacheIdentifier);
    };
    var invoke = function (scope, args) {
        var returnedValue = fn.apply(scope, args);
        cache(returnedValue);
        return returnedValue;
    };
    var resetCache = function () {
        cache(null, false);
        setCachedAt(null);
    };
    // cache controller setup
    if (isCacheControllerDefined()) {
        var options_1 = {
            cachingStartedAt: Date.now(),
            invokerName: fn.name,
            type: "function"
        };
        if (makeCacheable.tempOptions !== null) {
            options_1 = __assign({}, makeCacheable.tempOptions);
            makeCacheable.tempOptions = null;
        }
        // register self to the cache controller
        cacheController.registerSelf(cacheIdentifier, options_1);
        // define events handlers
        cacheController.on("cacheReset", function (payload) {
            if ((payload === null || payload === void 0 ? void 0 : payload.scope) === "all" || (payload === null || payload === void 0 ? void 0 : payload.scope.includes(cacheIdentifier)))
                resetCache();
        });
        cacheController.on("unlinkCacheKey", function (payload) {
            if (payload.key === cacheIdentifier) {
                isUnlinked = true;
                cacheController = null;
            }
        });
    }
    // cache setup
    cache(null, false);
    // return the callback
    var callback = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (canBeInvoked())
            return invoke(this, args);
        return cachedValue();
    };
    // attach some meta info to the callback
    callback.cacheMetadata = {
        key: cacheIdentifier,
        isCacheControllerDefined: isCacheControllerDefined,
        lastCacheTime: function () { return cachedAt; }
    };
    return callback;
}
exports.makeCacheable = makeCacheable;
makeCacheable.tempOptions = null;
makeCacheable.withOptions = function (opts) {
    makeCacheable.tempOptions = opts;
    return makeCacheable;
};
