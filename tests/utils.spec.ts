import {
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { memoize } from "../src";
import { MemoryStorage } from "../src/storages";

describe("utils module", () => {
  describe("memoize util", () => {
    it("should memoize function", () => {
      const fn = vi.fn(() => Date.now());
      const memoizedFn = memoize(fn, {
        ttl: 60_000,
        storage: new MemoryStorage(),
      });

      const value1 = memoizedFn();
      const value2 = memoizedFn();

      expect(fn).toHaveBeenCalledOnce();
      expect(value1).toEqual(value2);
    });
  });
});
