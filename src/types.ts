/* eslint-disable no-use-before-define */

import type MementoController from "./classes/MementoController/MementoController";
import { AnyFunction } from "./types.helpers";

export type CacheEntry<T = any> = {
  timestamp: number;
  value: T;
};

export interface Storage {
  type: "sync";
  set(functionId: string, argsId: string, value: CacheEntry): void;
  get<T>(functionId: string, argsId: string): CacheEntry<T> | undefined;
  clear(functionId: string, argsId?: string): void;
}

export interface AsyncStorage {
  type: "async";
  set(functionId: string, argsId: string, value: CacheEntry): Promise<void>;
  get<T>(functionId: string, argsId: string): Promise<CacheEntry<T> | undefined>;
  clear(functionId: string, argsId?: string): Promise<void>;
}

export type MementoConstructorOptions<S extends Storage | AsyncStorage> = {
  ttl: number;
  storage: S,
  controller?: MementoController;
  buildFunctionId?: (fn: AnyFunction) => string;
  buildArgumentsId?: (args: any[]) => string;
  isCacheEntryValid?: (cacheEntry: CacheEntry, options: IsCacheEntryValidOptions) => boolean;
};
export type OverrideMemoizeOptions<S extends Storage | AsyncStorage> = Partial<
  MementoConstructorOptions<S> & {
    functionId?: string;
  }
>;

export type IsCacheEntryValidOptions = {
  ttl: number;
};

export type MemoizedFunction<
  F extends AnyFunction,
  S extends Storage | AsyncStorage,
> = (...args: Parameters<F>) => (
  S extends Storage ? ReturnType<F> : Promise<ReturnType<F>>
);

export type MemoizationMetadata<S extends Storage | AsyncStorage> = Readonly<{
  ttl: number,
  functionId: string;
  storage: S;
  controller?: MementoController;
  buildArgumentsId?: (args: any[]) => string;
}>;
