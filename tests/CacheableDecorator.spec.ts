import { describe, expect, it } from "vitest";

import {
  cacheController,
  sleep,
  spiedFn,
  TestClass,
} from "./setup";

describe("Unit tests for Cacheable decorator", () => {
  const testObject = new TestClass();
  const seconds = () => new Date().getSeconds();

  it("should invoke the TestClass#methodOne() method correctly and cache it return value", () => {
    const args = [489, "s0m3t3xt"] as const;
    const returnedValue = testObject.methodOne(...args);
    const expectedString = `You passed arguments: ${args[0]}, ${args[1]}`;
    expect(returnedValue).toEqual(expectedString);
    expect(spiedFn).toHaveBeenCalled();
    spiedFn.mockClear();
    const returnedValue2 = testObject.methodOne(...args);
    expect(returnedValue2).toEqual(expectedString);
    expect(spiedFn).not.toHaveBeenCalled();
  });
  it("should return the correct number of seconds", async () => {
    const expectedSeconds = seconds();
    const receivedSeconds = testObject.getSeconds();
    expect(receivedSeconds).toEqual(expectedSeconds);
    const TIMEOUT_SECONDS = 2;
    await sleep(TIMEOUT_SECONDS);
    const actualSeconds = seconds();
    const receivedSeconds2 = testObject.getSeconds();
    expect(receivedSeconds2).toEqual(expectedSeconds);
    expect(receivedSeconds2).toEqual(actualSeconds - TIMEOUT_SECONDS);
  });
  it("should invoke the method again after keepAlive time", async () => {
    cacheController.resetCache();
    const expectedSeconds = seconds();
    const receivedSeconds = testObject.getSeconds();
    expect(receivedSeconds).toEqual(expectedSeconds);
    await sleep(2);
    const expectedSeconds2 = seconds();
    const receivedSeconds2 = testObject.getSeconds();
    expect(receivedSeconds2).not.toEqual(expectedSeconds2);
    expect(receivedSeconds2).toEqual(expectedSeconds);
    await sleep(3);
    const expectedSeconds3 = seconds();
    const receivedSeconds3 = testObject.getSeconds();
    expect(receivedSeconds3).toEqual(expectedSeconds3);
  });
});
