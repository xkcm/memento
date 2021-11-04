import { CacheController } from "./CacheController";

export interface CacheableConfiguration {
  keepAlive?: number;
  cacheController?: CacheController;
  key?: string;
}

export type CachedFunction<T extends (...args) => any> = {
  (...args: Parameters<T>): ReturnType<T>;
  cacheMetadata: {
    key: string;
    isCacheControllerDefined: () => boolean;
    lastCacheTime: () => number;
  };
}

export interface CacheControllerOptions {

}

export interface CacheInstanceInfo {
  type: "method" | "function";
  invokerName: string;
  cachingStartedAt: number;
  className?: string;
}
