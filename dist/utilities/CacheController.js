"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheController = void 0;
var eventemitter3_1 = require("eventemitter3");
var CacheController = /** @class */ (function (_super) {
    __extends(CacheController, _super);
    function CacheController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__controlledKeys = new Map();
        return _this;
    }
    CacheController.createController = function (options) {
        return new CacheController();
    };
    CacheController.setDefault = function (cacheController) {
        CacheController.default = cacheController;
    };
    CacheController.prototype.resetCache = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        if (keys.length > 0)
            this.emit("cacheReset", { scope: keys });
        this.emit("cacheReset", { scope: "all" });
    };
    CacheController.prototype.controlledCache = function () {
        return __spreadArray([], __read(this.__controlledKeys.keys()), false);
    };
    CacheController.prototype.registerSelf = function (key, opts) {
        if (this.__controlledKeys.has(key))
            return;
        this.__controlledKeys.set(key, opts);
        return true;
    };
    CacheController.prototype.getInfo = function (key) {
        return this.__controlledKeys.get(key);
    };
    CacheController.prototype.unlinkKey = function (key) {
        this.emit("unlinkCacheKey", { key: key });
        return this.__controlledKeys.delete(key);
    };
    CacheController.default = null;
    return CacheController;
}(eventemitter3_1.EventEmitter));
exports.CacheController = CacheController;
