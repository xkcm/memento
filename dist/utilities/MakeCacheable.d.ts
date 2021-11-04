import { CacheableConfiguration, CachedFunction, CacheInstanceInfo } from "./Types.d";
declare function makeCacheable<T extends (...args: any[]) => any>(fn: T, options?: CacheableConfiguration): CachedFunction<T>;
declare namespace makeCacheable {
    var tempOptions: CacheInstanceInfo;
    var withOptions: (opts: CacheInstanceInfo) => typeof makeCacheable;
}
export { makeCacheable };
