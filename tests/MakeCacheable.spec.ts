import { describe, expect, it } from "vitest";

import { CacheController, makeCacheable } from "../src";
import { sleep } from "./setup";

const getSeconds = () => new Date().getSeconds();
const randomNumber = () => Math.random();

const cacheKey = "some-custom-key";

const localCacheController = CacheController.createController();
const cachedGetSeconds = makeCacheable(getSeconds, {
  cacheController: localCacheController,
});
const cachedRandomNumber = makeCacheable(randomNumber, {
  cacheController: localCacheController,
  keepAlive: 500, // 500ms,
  key: cacheKey,
});

describe("Unit tests for makeCacheable utility", () => {
  it("should invoke the function correctly", () => {
    const expected = new Date().getSeconds();
    const received = cachedGetSeconds();
    expect(received).toEqual(expected);
  });
  it("should return the cached value", async () => {
    await sleep(5);
    const actual = new Date().getSeconds();
    const received = cachedGetSeconds();
    expect(received).not.toEqual(actual);
  });
  it("should return new value after resetting cache with CacheController", () => {
    localCacheController.resetCache();
    const expected = new Date().getSeconds();
    const received = cachedGetSeconds();
    expect(received).toEqual(expected);
  });
  it("should cache a number and then expire", async () => {
    const receivedValue1 = cachedRandomNumber();
    const receivedValue2 = cachedRandomNumber();
    expect(receivedValue1).toEqual(receivedValue2);
    await sleep(1);
    const receivedValue3 = cachedRandomNumber();
    expect(receivedValue3).not.toEqual(receivedValue2);
  });
  it("should contain correct metadata", () => {
    const meta = cachedRandomNumber.cacheMetadata;
    expect(meta.key).toEqual(cacheKey);
  });
});
