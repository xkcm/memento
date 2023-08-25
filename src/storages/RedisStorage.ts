import { AsyncStorage, MemoizationEntry, RedisClient } from "../types";

export class RedisStorage implements AsyncStorage {
  public type = "async" as const;

  constructor(protected redisClient: RedisClient) { }

  async set(functionId: string, argsId: string, entry: MemoizationEntry) {
    const resolvedValue = entry.value instanceof Promise ? await entry.value : entry.value;
    const newEntry = {
      ...entry,
      value: resolvedValue,
    };

    await this.redisClient.hSet(functionId, argsId, JSON.stringify(newEntry));
  }

  async get<T>(functionId: string, argsId: string): Promise<MemoizationEntry<T> | undefined> {
    const stringified = await this.redisClient.hGet(functionId, argsId);
    if (!stringified) {
      return;
    }

    return JSON.parse(stringified) as MemoizationEntry<T>; // eslint-disable-line consistent-return
  }

  async clear(functionId: string, argsId?: string): Promise<void> {
    if (!await this.redisClient.exists(functionId)) {
      return;
    }
    if (!argsId) {
      await this.redisClient.del(functionId);
      return;
    }

    await this.redisClient.hDel(functionId, argsId);
  }
}
