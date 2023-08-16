const StorageObject = new Map<string, any>();

const getItem = <T>(key: string): T => StorageObject.get(key);
const hasItem = (key: string): boolean => StorageObject.has(key);
const setItem = (key: string, value: any): boolean => {
  StorageObject.set(key, value);
  return hasItem(key);
};
const removeItem = (key: string): boolean => StorageObject.delete(key);
const modifyItem = (key: string, modifier: (<T>(val: T) => T)): boolean => setItem(
  key,
  modifier.call(modifier, getItem(key)),
);
const RegisteredKeys = new Set<string>();
const registeredKeys = () => [...RegisteredKeys.values()];
const isKeyAvailable = (key: string) => !RegisteredKeys.has(key);
const registerKey = (key: string) => {
  if (isKeyAvailable(key)) {
    RegisteredKeys.add(key);
  } else {
    throw new Error("Cache instance with given key is already registered");
  }
};
const deleteKey = (key: string, tryDeleteCacheItem = true) => {
  if (tryDeleteCacheItem) {
    try {
      removeItem(key);
    } catch {
      // ignore
    }
  }
  RegisteredKeys.delete(key);
};

export {
  deleteKey,
  getItem, hasItem,
  isKeyAvailable,
  modifyItem,
  registeredKeys, registerKey, removeItem, setItem,
};
