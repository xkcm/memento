"use strict";
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
exports.deleteKey = exports.registerKey = exports.isKeyAvailable = exports.registeredKeys = exports.modifyItem = exports.removeItem = exports.hasItem = exports.setItem = exports.getItem = void 0;
var __StorageObject = new Map();
var getItem = function (key) {
    return __StorageObject.get(key);
};
exports.getItem = getItem;
var setItem = function (key, value) {
    __StorageObject.set(key, value);
    return hasItem(key);
};
exports.setItem = setItem;
var removeItem = function (key) {
    return __StorageObject.delete(key);
};
exports.removeItem = removeItem;
var hasItem = function (key) {
    return __StorageObject.has(key);
};
exports.hasItem = hasItem;
var modifyItem = function (key, modifier) {
    return setItem(key, modifier.call(modifier, getItem(key)));
};
exports.modifyItem = modifyItem;
var __RegisteredKeys = new Set();
var registeredKeys = function () {
    return __spreadArray([], __read(__RegisteredKeys.values()), false);
};
exports.registeredKeys = registeredKeys;
var isKeyAvailable = function (key) {
    return !__RegisteredKeys.has(key);
};
exports.isKeyAvailable = isKeyAvailable;
var registerKey = function (key) {
    if (isKeyAvailable(key))
        __RegisteredKeys.add(key);
    else
        throw new Error("Cache instance with given key is already registered");
};
exports.registerKey = registerKey;
var deleteKey = function (key, tryDeleteCacheItem) {
    if (tryDeleteCacheItem === void 0) { tryDeleteCacheItem = true; }
    if (tryDeleteCacheItem) {
        try {
            removeItem(key);
        }
        catch (e) { }
    }
    __RegisteredKeys.delete(key);
};
exports.deleteKey = deleteKey;
