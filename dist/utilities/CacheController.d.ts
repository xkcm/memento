import { CacheControllerOptions, CacheInstanceInfo } from "./Types.d";
import { EventEmitter } from 'eventemitter3';
export declare class CacheController extends EventEmitter {
    static default: CacheController;
    static createController(options?: CacheControllerOptions): CacheController;
    static setDefault(cacheController: CacheController): void;
    private __controlledKeys;
    resetCache(...keys: string[]): void;
    controlledCache(): string[];
    registerSelf(key: string, opts: CacheInstanceInfo): boolean;
    getInfo(key: string): CacheInstanceInfo;
    unlinkKey(key: string): boolean;
}
