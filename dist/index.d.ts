import { Cacheable } from './utilities/CacheableDecorator';
import { CacheController } from './utilities/CacheController';
import { makeCacheable } from './utilities/MakeCacheable';
declare const Storage: {
    isKeyAvailable: (key: string) => boolean;
    registeredKeys: () => string[];
    modifyItem: (key: string, modifier: <T extends unknown>(val: T) => T) => boolean;
    getItem: <T_1 extends unknown>(key: string) => T_1;
};
export { Cacheable, CacheController, makeCacheable };
export { Storage };
