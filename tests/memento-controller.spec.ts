import {
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  Memento,
  MementoController,
  extractMemoizationMetadata,
} from "../src";
import { MemoryStorage } from "../src/storages";
import { TestAsyncStorage, TestStorage } from "./helpers";

describe("Memento Controller", () => {
  it("should use Memento Controller and invalidate using custom functionId", async () => {
    const fn = vi.fn(() => Math.random());

    const controller = new MementoController();
    const memento = new Memento({
      ttl: 60_000,
      storage: new MemoryStorage(),
      controller,
    });
    const memoizedFn = memento.memoize(fn, {
      functionId: "date_getter",
    });

    const value1 = memoizedFn();
    const value2 = memoizedFn();

    await controller.invalidate("date_getter");
    const value3 = memoizedFn();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(value1).toEqual(value2);
    expect(value3).not.toEqual(value1);
  });

  it("should invalidate using invalidateAll", async () => {
    const fn = vi.fn(() => Math.random());

    const controller = new MementoController();
    const memento = new Memento({
      ttl: 60_000,
      storage: new MemoryStorage(),
      controller,
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = memoizedFn();
    const value2 = memoizedFn();

    await controller.invalidateAll();
    const value3 = memoizedFn();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(value1).toEqual(value2);
    expect(value3).not.toEqual(value1);
  });

  it("should invalidate all with sync and async storages", async () => {
    const fn1 = vi.fn(() => Math.random());
    const fn2 = vi.fn(() => Math.random());

    const controller = new MementoController();
    const memento = new Memento({
      ttl: 60_000,
      storage: new TestStorage(),
      controller,
    });

    const memoizedFn = memento.memoize(fn1);
    const asyncMemoizedFn = memento.memoize(fn2, {
      storage: new TestAsyncStorage(),
    });

    const value1 = memoizedFn();
    const value2 = memoizedFn();
    const asyncValue1 = await asyncMemoizedFn();
    const asyncValue2 = await asyncMemoizedFn();

    await controller.invalidateAll();

    const value3 = memoizedFn();
    const asyncValue3 = await asyncMemoizedFn();

    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(value1).toEqual(value2);
    expect(asyncValue1).toEqual(asyncValue2);
    expect(value3).not.toEqual(value1);
    expect(asyncValue3).not.toEqual(asyncValue1);
  });

  it("should read memoized functionId and invalidate", async () => {
    const fn = vi.fn(() => Math.random());

    const controller = new MementoController();
    const memento = new Memento({
      ttl: 60_000,
      storage: new MemoryStorage(),
      controller,
    });
    const memoizedFn = memento.memoize(fn);
    const { functionId } = extractMemoizationMetadata(memoizedFn);

    const value1 = memoizedFn();
    await controller.invalidate(functionId);
    const value2 = memoizedFn();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(value1).not.toEqual(value2);
  });
});
