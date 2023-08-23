/* eslint-disable max-classes-per-file */
import { AsyncStorage, MemoizationEntry, Storage } from "../src/types";

export const delay = (ms: number) => new Promise((res) => {
  setTimeout(res, ms);
});

export class TestAsyncStorage implements AsyncStorage {
  type = "async" as const;

  public memoizationObject: Record<string, any> = {};

  async set(functionId: string, argsId: string, entry: MemoizationEntry<any>): Promise<void> {
    if (!this.memoizationObject[functionId]) {
      this.memoizationObject[functionId] = {};
    }
    this.memoizationObject[functionId][argsId] = entry;
  }

  async get(functionId: string, argsId: string) {
    return this.memoizationObject[functionId]?.[argsId];
  }

  async clear(functionId: string, argsId: string) {
    if (!this.memoizationObject[functionId]) {
      return;
    }
    if (!argsId) {
      delete this.memoizationObject[functionId];
      return;
    }

    delete this.memoizationObject[functionId][argsId];
  }
}

export class TestStorage implements Storage {
  type = "sync" as const;

  public memoizationObject: Record<string, any> = {};

  set(functionId: string, argsId: string, entry: MemoizationEntry<any>): void {
    if (!this.memoizationObject[functionId]) {
      this.memoizationObject[functionId] = {};
    }
    this.memoizationObject[functionId][argsId] = entry;
  }

  get(functionId: string, argsId: string) {
    return this.memoizationObject[functionId]?.[argsId];
  }

  clear(functionId: string, argsId: string) {
    if (!this.memoizationObject[functionId]) {
      return;
    }
    if (!argsId) {
      delete this.memoizationObject[functionId];
      return;
    }

    delete this.memoizationObject[functionId][argsId];
  }
}
