import {
  assertMemoizeOptions,
  defaultBuildArgumentsId,
  defaultBuildFunctionId,
  defaultIsCacheEntryValid,
  isStorageSync,
} from "../../helpers";
import {
  AsyncStorage,
  MementoConstructorOptions,
  MemoizedFunction,
  OverrideMemoizeOptions,
  Storage,
} from "../../types";
import { AnyFunction } from "../../types.helpers";
import { ConstructorOptionRequiredError } from "./Memento.errors";

export default class Memento<S extends AsyncStorage | Storage> {
  public constructor(
    protected options: MementoConstructorOptions<S>,
  ) {
    if (!options.storage) {
      throw new ConstructorOptionRequiredError({ metadata: { option: "storage" } });
    }
    if (!options.ttl) {
      throw new ConstructorOptionRequiredError({ metadata: { option: "ttl" } });
    }
  }

  public memoize<F extends AnyFunction, MS extends AsyncStorage | Storage = S>(
    fn: F,
    overrideOptions: OverrideMemoizeOptions<MS> = {},
  ): MemoizedFunction<F, MS> {
    const resolvedOptions = { ...this.options, ...overrideOptions };
    const {
      ttl,
      storage,
      controller,
      buildFunctionId = defaultBuildFunctionId,
      buildArgumentsId = defaultBuildArgumentsId,
      isCacheEntryValid = defaultIsCacheEntryValid,
      functionId = buildFunctionId(fn),
    } = resolvedOptions;

    assertMemoizeOptions(functionId, { storage, ttl });

    controller?.register(functionId, storage);

    let memoizedFunction;
    if (isStorageSync(storage)) {
      memoizedFunction = ((...args: Parameters<F>) => {
        const argsId = buildArgumentsId(args);
        const cacheEntry = storage.get<ReturnType<F>>(functionId, argsId);

        if (cacheEntry && isCacheEntryValid(cacheEntry, { ttl })) {
          return cacheEntry.value;
        }

        const fnValue = fn(...args);
        storage.set(
          functionId,
          argsId,
          {
            timestamp: Date.now(),
            value: fnValue,
          },
        );

        return fnValue;
      }) as MemoizedFunction<F, MS>;
    } else {
      memoizedFunction = (async (...args: Parameters<F>) => {
        const argsId = buildArgumentsId(args);
        const cacheEntry = await storage.get<ReturnType<F>>(functionId, argsId);

        if (cacheEntry && isCacheEntryValid(cacheEntry, { ttl })) {
          return cacheEntry.value;
        }

        const fnValue = fn(...args);
        await storage.set(
          functionId,
          argsId,
          {
            timestamp: Date.now(),
            value: fnValue,
          },
        );

        return fnValue;
      }) as MemoizedFunction<F, MS>;
    }

    const memoizationMetadata: Record<string, any> = {
      ttl,
      storage,
      functionId,
      buildArgumentsId,
    };
    if (controller) {
      memoizationMetadata.controller = controller;
    }

    Reflect.defineMetadata(
      "memoization",
      memoizationMetadata,
      memoizedFunction,
    );

    return memoizedFunction;
  }
}
