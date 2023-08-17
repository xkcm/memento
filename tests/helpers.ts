/* eslint-disable max-classes-per-file */
import { AsyncStorage, CacheEntry, Storage } from "../src/types";

export const delay = (ms: number) => new Promise((res) => {
  setTimeout(res, ms);
});

export class TestAsyncStorage implements AsyncStorage {
  type = "async" as const;

  public cacheObject: Record<string, any> = {};

  async set(functionId: string, argsId: string, cacheEntry: CacheEntry<any>): Promise<void> {
    if (!this.cacheObject[functionId]) {
      this.cacheObject[functionId] = {};
    }
    this.cacheObject[functionId][argsId] = cacheEntry;
  }

  async get(functionId: string, argsId: string) {
    return this.cacheObject[functionId]?.[argsId];
  }

  async clear(functionId: string, argsId: string) {
    if (!this.cacheObject[functionId]) {
      return;
    }
    if (!argsId) {
      delete this.cacheObject[functionId];
      return;
    }

    delete this.cacheObject[functionId][argsId];
  }
}

export class TestStorage implements Storage {
  type = "sync" as const;

  public cacheObject: Record<string, any> = {};

  set(functionId: string, argsId: string, cacheEntry: CacheEntry<any>): void {
    if (!this.cacheObject[functionId]) {
      this.cacheObject[functionId] = {};
    }
    this.cacheObject[functionId][argsId] = cacheEntry;
  }

  get(functionId: string, argsId: string) {
    return this.cacheObject[functionId]?.[argsId];
  }

  clear(functionId: string, argsId: string) {
    if (!this.cacheObject[functionId]) {
      return;
    }
    if (!argsId) {
      delete this.cacheObject[functionId];
      return;
    }

    delete this.cacheObject[functionId][argsId];
  }
}
