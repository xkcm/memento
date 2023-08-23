import {
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Memento } from "../src";
import { TestStorage } from "./helpers";

describe("Custom storage", () => {
  it("should use object for storing memoization values", () => {
    const storage = new TestStorage();

    const fn = vi.fn(() => Date.now());

    const memento = new Memento({
      ttl: 60_000,
      storage,
    });
    const memoizedFn = memento.memoize(fn);

    const value1 = memoizedFn();
    const value2 = memoizedFn();

    expect(fn).toHaveBeenCalledOnce();
    expect(value1).toEqual(value2);
    expect(Object.keys(storage.memoizationObject)).toHaveLength(1);
  });
});
