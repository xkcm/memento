import { CacheControllerOptions, CacheInstanceInfo } from "./Types.d"
import { EventEmitter } from 'eventemitter3'

export class CacheController extends EventEmitter {

  public static default: CacheController = null
  static createController(options?: CacheControllerOptions){
    return new CacheController()
  }
  static setDefault(cacheController: CacheController){
    CacheController.default = cacheController
  }
  private __controlledKeys = new Map<string, CacheInstanceInfo>()

  public resetCache(...keys: string[]){
    if (keys.length > 0) this.emit("cacheReset", { scope: keys })
    this.emit("cacheReset", { scope: "all" })
  }
  public controlledCache(){
    return [...this.__controlledKeys.keys()]
  }
  public registerSelf(key: string, opts: CacheInstanceInfo){
    if (this.__controlledKeys.has(key)) return
    this.__controlledKeys.set(key, opts)
    return true
  }
  public getInfo(key: string){
    return this.__controlledKeys.get(key)
  }
  public unlinkKey(key: string){
    this.emit("unlinkCacheKey", { key })
    return this.__controlledKeys.delete(key)
  }
}

