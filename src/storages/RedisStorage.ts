import { AsyncStorage, MemoizationEntry, RedisClient } from "../types";

export class RedisStorage implements AsyncStorage {
  public type = "async" as const;

  constructor(protected redisClient: RedisClient) { }

  async set(functionId: string, argsId: string, value: MemoizationEntry) {
    await this.redisClient.hSet(functionId, argsId, JSON.stringify(value));
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
