import { makeCacheable } from "./MakeCacheable";
import { CacheableConfiguration } from "./Types";

/**
 * Cacheable decorator for methods
 * @param {CacheableConfiguration} options - Options for `Cacheable` decorator
 */
function Cacheable(options?: CacheableConfiguration) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const value = makeCacheable.withOptions({
      cachingStartedAt: Date.now(),
      invokerName: propertyKey,
      type: "method",
      className: target.constructor.name,
    })(descriptor.value, options);

    return {
      ...descriptor,
      value,
    };
  };
}

export { Cacheable };
