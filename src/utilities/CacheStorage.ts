
const __StorageObject = new Map<String, any>()

const getItem = <T extends unknown>(key: string): T => {
  return __StorageObject.get(key)
}
const setItem = (key: string, value: any): boolean => {
  __StorageObject.set(key, value)
  return hasItem(key)
}
const removeItem = (key: string): boolean => {
  return __StorageObject.delete(key)
}
const hasItem = (key: string): boolean => {
  return __StorageObject.has(key)
}
const modifyItem = (key: string, modifier: (<T extends unknown>(val: T) => T)): boolean => {
  return setItem(
    key,
    modifier.call(
      modifier, getItem(key)
    )
  )
}
const __RegisteredKeys = new Set<string>()
const registeredKeys = () => {
  return [...__RegisteredKeys.values()]
}
const isKeyAvailable = (key: string) => {
  return !__RegisteredKeys.has(key)
}
const registerKey = (key: string) => {
  if (isKeyAvailable(key)) __RegisteredKeys.add(key)
  else throw new Error("Cache instance with given key is already registered")
}
const deleteKey = (key: string, tryDeleteCacheItem = true) => {
  if (tryDeleteCacheItem){
    try {
      removeItem(key)
    }
    catch (e) {}
  }
  __RegisteredKeys.delete(key)
}

export {
  getItem, setItem, hasItem,
  removeItem, modifyItem,
  registeredKeys, isKeyAvailable,
  registerKey, deleteKey
}