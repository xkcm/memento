import {
  describe, expect, it, vi,
} from "vitest";
import { Memento } from "../src";
import { MemoryStorage } from "../src/storages";
import { TestAsyncStorage } from "./helpers";

describe("Memoizing async functions", () => {
  it("should memoize async function", async () => {
    const mockValue = "test";
    const fn = vi.fn(() => Promise.resolve(mockValue));

    const memento = new Memento({
      ttl: 1000,
      storage: new MemoryStorage(),
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = await memoizedFn();
    const value2 = await memoizedFn();

    expect(fn).toHaveBeenCalledOnce();
    expect(value1).toEqual(value2);
  });

  it("should use async storage", async () => {
    const fn = vi.fn(() => Date.now());

    const storage = new TestAsyncStorage();
    const memento = new Memento({
      ttl: 60_000,
      storage,
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = await memoizedFn();
    const value2 = await memoizedFn();

    expect(fn).toHaveBeenCalledOnce();
    expect(value1).toEqual(value2);
    expect(Object.keys(storage.memoizationObject)).toHaveLength(1);
  });

  it("should memoize async function with async storage", async () => {
    const fn = vi.fn(async () => Math.random());

    const storage = new TestAsyncStorage();
    const memento = new Memento({
      ttl: 60_000,
      storage,
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = await memoizedFn();
    const value2 = await memoizedFn();

    expect(fn).toHaveBeenCalledOnce();
    expect(value1).toEqual(value2);
    expect(Object.keys(storage.memoizationObject)).toHaveLength(1);
  });
});
