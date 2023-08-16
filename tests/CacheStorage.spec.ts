import { describe, expect, it } from "vitest";

import * as Storage from "../src/utilities/CacheStorage";

describe("Unit tests for cache storage unit", () => {
  it("should set an item to a storage and then remove it", () => {
    const item = "s0m3d4t4v3ry1mp0rt4nt";
    const key = "s0m3r4nd0mk3y";
    expect(Storage.setItem(key, item)).toBeTruthy();
    const itemFromStorage = Storage.getItem(key);
    expect(itemFromStorage).toEqual(item);
    expect(Storage.removeItem(key)).toBeTruthy();
    expect(Storage.hasItem(key)).toBeFalsy();
  });
  it("should fail to remove an item from a storage", () => {
    const key = "thiskeydoesnotexistinstorage";
    expect(Storage.removeItem(key)).toBeFalsy();
  });
  it("should set an item correctly", () => {
    expect(Storage.setItem("something", {
      a: {
        very: {
          complicated: {
            object: ["right", {
              xyz: new Set([3, 4, 5]),
            }],
          },
        },
      },
    })).toBeTruthy();
  });
});
