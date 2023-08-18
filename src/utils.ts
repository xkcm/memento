import Memento from "./classes/Memento/Memento";
import {
  AsyncStorage,
  MementoConstructorOptions,
  MemoizationMetadata,
  MemoizedFunction,
  Storage,
} from "./types";
import { AnyFunction } from "./types.helpers";

export const memoize = <F extends AnyFunction, S extends Storage | AsyncStorage = Storage>(
  fn: F,
  options: MementoConstructorOptions<S> & {
    functionId?: string;
  }
  ,
): MemoizedFunction<F, S> => (
  new Memento(options).memoize(fn, options)
);

export const extractMemoizationMetadata = <F extends MemoizedFunction<any, any>>(
  memoizedFunction: F,
): MemoizationMetadata<F extends MemoizedFunction<any, infer S> ? S : Storage | AsyncStorage> => (
  Reflect.getMetadata("memoization", memoizedFunction)
);
