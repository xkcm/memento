import { Cacheable } from './utilities/CacheableDecorator'
import { CacheController } from './utilities/CacheController'
import { makeCacheable } from './utilities/MakeCacheable'
import { isKeyAvailable, modifyItem, getItem, registeredKeys } from './utilities/CacheStorage'

const Storage = {
  isKeyAvailable,
  registeredKeys,
  modifyItem,
  getItem
}

export { Cacheable, CacheController, makeCacheable }
export { Storage }