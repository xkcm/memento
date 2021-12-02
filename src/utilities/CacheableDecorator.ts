import { makeCacheable } from './MakeCacheable'
import { CacheableConfiguration, CachedFunction } from './Types'

/**
 * Cacheable decorator for methods
 * @param {CacheableConfiguration} options - Options for `Cacheable` decorator
 */
function Cacheable(options?: CacheableConfiguration){

  return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor){

    descriptor.value = makeCacheable.withOptions({
      cachingStartedAt: Date.now(),
      invokerName: propertyKey,
      type: "method",
      className: target.constructor.name
    })(descriptor.value, options)

  }
}

export { Cacheable }
