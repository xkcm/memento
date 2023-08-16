import { EventEmitter } from "eventemitter3";

import { CacheControllerOptions, CacheInstanceInfo } from "./Types";

export class CacheController extends EventEmitter {
  // eslint-disable-next-line no-use-before-define
  public static default: CacheController = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static createController(options?: CacheControllerOptions) {
    return new CacheController();
  }

  static setDefault(cacheController: CacheController) {
    CacheController.default = cacheController;
  }

  private controlledKeys = new Map<string, CacheInstanceInfo>();

  public resetCache(...keys: string[]) {
    if (keys.length > 0) {
      this.emit("cacheReset", { scope: keys });
    }
    this.emit("cacheReset", { scope: "all" });
  }

  public controlledCache() {
    return [...this.controlledKeys.keys()];
  }

  public registerSelf(key: string, opts: CacheInstanceInfo) {
    if (this.controlledKeys.has(key)) {
      return;
    }

    this.controlledKeys.set(key, opts);
  }

  public getInfo(key: string) {
    return this.controlledKeys.get(key);
  }

  public unlinkKey(key: string) {
    this.emit("unlinkCacheKey", { key });
    return this.controlledKeys.delete(key);
  }
}
