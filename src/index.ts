import { Cacheable } from "./utilities/CacheableDecorator";
import { CacheController } from "./utilities/CacheController";
import {
  getItem,
  isKeyAvailable,
  modifyItem,
  registeredKeys,
} from "./utilities/CacheStorage";
import { makeCacheable } from "./utilities/MakeCacheable";

const Storage = {
  isKeyAvailable,
  registeredKeys,
  modifyItem,
  getItem,
};

export {
  Cacheable,
  CacheController,
  makeCacheable,
  Storage,
};
