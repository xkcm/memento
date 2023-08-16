import { v4 as uuidv4 } from "uuid";

import { CacheController } from "./CacheController";
import * as Storage from "./CacheStorage";
import { CacheableConfiguration, CachedFunction, CacheInstanceInfo } from "./Types";

function makeCacheable<
  T extends (...args) => any,
>(fn: T, options?: CacheableConfiguration): CachedFunction<T> {
  // declarations and configuration

  const keepAlive = options?.keepAlive || Infinity; // Do not remove the return value from cache

  let cacheController: CacheController = options?.cacheController || CacheController.default;
  let isUnlinked = false;
  let cachedAt: number = null;

  const cacheIdentifier: string = options?.key || uuidv4();

  // register the key, can throw an error

  Storage.registerKey(cacheIdentifier);

  const cachedValue = () => Storage.getItem(cacheIdentifier);
  const setCachedAt = (value: any) => {
    cachedAt = value;
  };
  const canBeInvoked = () => (
    cachedValue() === null || cachedAt === null || cachedAt + keepAlive <= Date.now()
  );
  const isCacheControllerDefined = () => cacheController !== null && !isUnlinked;
  const cache = (value: any, onRecord = true) => {
    if (onRecord) {
      setCachedAt(Date.now());
    }
    Storage.setItem(cacheIdentifier, value);

    if (isCacheControllerDefined()) {
      cacheController.emit("cacheUpdate", { key: cacheIdentifier, value, timestamp: cachedAt });
    }
  };
  const invoke = (scope: any, args: any[]) => {
    const returnedValue = fn.apply(scope, args);
    cache(returnedValue);
    return returnedValue;
  };
  const resetCache = () => {
    cache(null, false);
    setCachedAt(null);
  };

  // cache controller setup

  if (isCacheControllerDefined()) {
    let registerOptions: CacheInstanceInfo = {
      cachingStartedAt: Date.now(),
      invokerName: fn.name,
      type: "function",
    };
    if (makeCacheable.tempOptions !== null) {
      registerOptions = { ...makeCacheable.tempOptions };
      makeCacheable.tempOptions = null;
    }
    // register self to the cache controller
    cacheController.registerSelf(cacheIdentifier, registerOptions);
    // define events handlers
    cacheController.on("cacheReset", (payload: { scope: string | string[] }) => {
      if (payload?.scope === "all" || payload?.scope.includes(cacheIdentifier)) {
        resetCache();
      }
    });
    cacheController.on("unlinkCacheKey", (payload: { key: string }) => {
      if (payload.key === cacheIdentifier) {
        isUnlinked = true;
        cacheController = null;
      }
    });
  }

  // cache setup

  cache(null, false);

  // return the callback

  const callback = (...args) => {
    if (canBeInvoked()) {
      return invoke(this, args);
    }
    return cachedValue();
  };

  // attach some meta info to the callback

  callback.cacheMetadata = {
    key: cacheIdentifier,
    isCacheControllerDefined,
    lastCacheTime: () => cachedAt,
  };

  return callback;
}

makeCacheable.tempOptions = null as CacheInstanceInfo;

makeCacheable.withOptions = (opts: CacheInstanceInfo) => {
  makeCacheable.tempOptions = opts;
  return makeCacheable;
};

export { makeCacheable };
