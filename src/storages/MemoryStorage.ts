import { CacheEntry, Storage } from "../types";

export class MemoryStorage implements Storage {
  public type = "sync" as const;

  private items = new Map<
    string,
    Map<string, CacheEntry>
  >();

  set(functionId: string, argsId: string, value: CacheEntry): void {
    let argsMap = this.items.get(functionId);
    if (!argsMap) {
      argsMap = new Map();
      this.items.set(functionId, argsMap);
    }

    argsMap.set(argsId, value);
    this.items.set(functionId, argsMap);
  }

  get<T>(functionId: string, argsId: string): CacheEntry<T> | undefined {
    return this.items.get(functionId)?.get(argsId);
  }

  clear(functionId: string, argsId?: string) {
    if (!this.items.has(functionId)) {
      return;
    }
    if (!argsId) {
      this.items.delete(functionId);
      return;
    }

    const argsMap = this.items.get(functionId)!;
    argsMap.delete(argsId);
    this.items.set(functionId, argsMap);
  }
}
