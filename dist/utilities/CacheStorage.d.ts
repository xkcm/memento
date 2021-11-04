declare const getItem: <T extends unknown>(key: string) => T;
declare const setItem: (key: string, value: any) => boolean;
declare const removeItem: (key: string) => boolean;
declare const hasItem: (key: string) => boolean;
declare const modifyItem: (key: string, modifier: <T extends unknown>(val: T) => T) => boolean;
declare const registeredKeys: () => string[];
declare const isKeyAvailable: (key: string) => boolean;
declare const registerKey: (key: string) => void;
declare const deleteKey: (key: string, tryDeleteCacheItem?: boolean) => void;
export { getItem, setItem, hasItem, removeItem, modifyItem, registeredKeys, isKeyAvailable, registerKey, deleteKey };