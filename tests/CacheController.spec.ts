import { CacheInstanceInfo } from "../src/utilities/CacheController.d"
import { cacheController } from "./setup"

describe("Unit tests for CacheController", () => {
  it("should have 2 controlled keys", () => {
    const controlled = cacheController.controlledCache()
    expect(controlled.length).toEqual(3)
  })
  it("should get info about first key", () => {
    const [key] = cacheController.controlledCache()
    const info = cacheController.getInfo(key)
    expect(info).toMatchObject<CacheInstanceInfo>({ cachingStartedAt: expect.any(Number), invokerName: expect.any(String), type: "method" })
  })
  it("should unlink a key from controlled keys", () => {
    const [key] = cacheController.controlledCache()
    expect(cacheController.unlinkKey(key)).toBeTruthy()
    expect(cacheController.controlledCache().length).toEqual(2)
  })
})