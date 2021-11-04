"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = exports.makeCacheable = exports.CacheController = exports.Cacheable = void 0;
var CacheableDecorator_1 = require("./utilities/CacheableDecorator");
Object.defineProperty(exports, "Cacheable", { enumerable: true, get: function () { return CacheableDecorator_1.Cacheable; } });
var CacheController_1 = require("./utilities/CacheController");
Object.defineProperty(exports, "CacheController", { enumerable: true, get: function () { return CacheController_1.CacheController; } });
var MakeCacheable_1 = require("./utilities/MakeCacheable");
Object.defineProperty(exports, "makeCacheable", { enumerable: true, get: function () { return MakeCacheable_1.makeCacheable; } });
var CacheStorage_1 = require("./utilities/CacheStorage");
var Storage = {
    isKeyAvailable: CacheStorage_1.isKeyAvailable,
    registeredKeys: CacheStorage_1.registeredKeys,
    modifyItem: CacheStorage_1.modifyItem,
    getItem: CacheStorage_1.getItem
};
exports.Storage = Storage;
