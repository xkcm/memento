import { CacheableConfiguration } from './Types.d';
/**
 * Cacheable decorator for methods
 * @param {CacheableConfiguration} options - Options for `Cacheable` decorator
 */
declare function Cacheable(options?: CacheableConfiguration): (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => void;
export { Cacheable };
