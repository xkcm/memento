"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacheable = void 0;
var MakeCacheable_1 = require("./MakeCacheable");
/**
 * Cacheable decorator for methods
 * @param {CacheableConfiguration} options - Options for `Cacheable` decorator
 */
function Cacheable(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value = MakeCacheable_1.makeCacheable.withOptions({
            cachingStartedAt: Date.now(),
            invokerName: propertyKey,
            type: "method",
            className: target.constructor.name
        })(descriptor.value, options);
    };
}
exports.Cacheable = Cacheable;
