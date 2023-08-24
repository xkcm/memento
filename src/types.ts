/* eslint-disable no-use-before-define */

import type MementoController from "./classes/MementoController/MementoController";
import { AnyFunction } from "./types.helpers";

export type MemoizationEntry<T = any> = {
  timestamp: number;
  value: T;
};

export interface Storage {
  type: "sync";
  set(functionId: string, argsId: string, value: MemoizationEntry): void;
  get<T>(functionId: string, argsId: string): MemoizationEntry<T> | undefined;
  clear(functionId: string, argsId?: string): void;
}

export interface AsyncStorage {
  type: "async";
  set(functionId: string, argsId: string, value: MemoizationEntry): Promise<void>;
  get<T>(functionId: string, argsId: string): Promise<MemoizationEntry<T> | undefined>;
  clear(functionId: string, argsId?: string): Promise<void>;
}

export type MementoConstructorOptions<S extends Storage | AsyncStorage> = {
  ttl: number;
  storage: S,
  controller?: MementoController;
  buildFunctionId?: (fn: AnyFunction) => string;
  buildArgumentsId?: (args: any[]) => string;
  isMemoizationEntryValid?: (
    (entry: MemoizationEntry, options: IsMemoizationEntryValidOptions) => boolean
  );
};
export type OverrideMemoizeOptions<S extends Storage | AsyncStorage> = Partial<
  MementoConstructorOptions<S> & {
    functionId?: string;
  }
>;

export type IsMemoizationEntryValidOptions = {
  ttl: number;
};

export type MemoizedFunction<
  F extends AnyFunction,
  S extends Storage | AsyncStorage,
> = (...args: Parameters<F>) => (
  S extends Storage ? ReturnType<F> : Promise<Awaited<ReturnType<F>>>
);

export type MemoizationMetadata<S extends Storage | AsyncStorage> = Readonly<{
  ttl: number,
  functionId: string;
  storage: S;
  buildArgumentsId: (args: any[]) => string;
  controller?: MementoController;
}>;

export interface RedisClient {
  hSet(key: string, field: string, value: string): Promise<any>;
  hGet(key: string, field: string): Promise<string | undefined>;
  exists(key: string): Promise<number>;
  del(key: string): Promise<any>;
  hDel(key: string, field: string): Promise<any>;
}
