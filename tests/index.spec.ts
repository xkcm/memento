import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Memento } from "../src";
import { MemoryStorage } from "../src/storages";
import { delay } from "./helpers";
import { ConstructorOptionRequiredError, MemoizeOptionRequiredError } from "../src/classes/Memento/Memento.errors";

describe("Main functionality", () => {
  it("should return cached value", async () => {
    const fn = vi.fn(() => Date.now());

    const memento = new Memento({
      ttl: 60_000,
      storage: new MemoryStorage(),
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = memoizedFn();
    await delay(50);
    const value2 = memoizedFn();

    expect(fn).toHaveBeenCalledOnce();
    expect(value1).toEqual(value2);
  });

  it("should update cached value after it expires", async () => {
    const fn = vi.fn(() => Date.now());
    const memento = new Memento({
      ttl: 500,
      storage: new MemoryStorage(),
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = memoizedFn();
    await delay(50);
    const value2 = memoizedFn();
    await delay(500);
    const value3 = memoizedFn();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(value1).toEqual(value2);
    expect(value3).not.toEqual(value1);
  });

  it("should not use cached value if args are different", async () => {
    const performCalculations = (a: number, b: number) => a + b;
    const fn = vi.fn((a: number, b: number) => performCalculations(a, b));

    const memento = new Memento({
      ttl: 1000,
      storage: new MemoryStorage(),
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = memoizedFn(1, 2);
    const value2 = memoizedFn(3, 4);
    const value3 = memoizedFn(3, 4);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 1, 2);
    expect(fn).toHaveBeenNthCalledWith(2, 3, 4);

    expect(value1).toEqual(performCalculations(1, 2));
    expect(value2).toEqual(performCalculations(3, 4));
    expect(value3).toEqual(value2);
  });
});

/* eslint-disable no-new */

describe("Errors", () => {
  it("should throw error from constructor if \"storage\" or \"ttl\" option is absent", () => {
    expect(() => {
      new Memento({
        storage: new MemoryStorage(),
      } as any);
    }).toThrowError(ConstructorOptionRequiredError);

    expect(() => {
      new Memento({
        ttl: 30_000,
      } as any);
    }).toThrowError(ConstructorOptionRequiredError);

    expect(() => {
      new Memento({} as any);
    }).toThrowError(ConstructorOptionRequiredError);
  });

  it("shoudl throw error from .memoize if \"storage\" or \"ttl\" option is absent", () => {
    const memento = new Memento({
      storage: new MemoryStorage(),
      ttl: 60_000,
    });

    expect(() => {
      memento.memoize(() => { }, {
        ttl: undefined,
      });
    }).toThrowError(MemoizeOptionRequiredError);

    expect(() => {
      memento.memoize(() => { }, {
        storage: undefined,
      });
    }).toThrowError(MemoizeOptionRequiredError);

    expect(() => {
      memento.memoize(() => { }, {
        ttl: undefined,
        storage: undefined,
      });
    }).toThrowError(MemoizeOptionRequiredError);
  });
});
