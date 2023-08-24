import sha256 from "sha256";
import { v4 as generateUUID } from "uuid";

import {
  AsyncStorage,
  MemoizationEntry,
  IsMemoizationEntryValidOptions,
  Storage,
} from "./types";
import { AnyFunction } from "./types.helpers";
import { MemoizeOptionRequiredError } from "./classes/Memento/Memento.errors";

export const defaultBuildFunctionId = (fn: AnyFunction) => `${fn.name}_${generateUUID()}`;

export const defaultBuildArgumentsId = (args: any[]) => {
  const stringified = args ? JSON.stringify(args) : "<empty>";
  return sha256(stringified);
};

export const defaultIsMemoizationEntryValid = (
  entry: MemoizationEntry,
  options: IsMemoizationEntryValidOptions,
) => {
  const expirationTimestamp = entry.timestamp + options.ttl;

  return (
    (Date.now() < expirationTimestamp || options.ttl === -1)
  );
};

export const isStorageSync = (storage: Storage | AsyncStorage): storage is Storage => storage.type === "sync";

export const assertMemoizeOptions = (functionId: string, options: Record<string, any>) => {
  Object.entries(options).forEach(([key, value]) => {
    if (!value) {
      throw new MemoizeOptionRequiredError({
        metadata: {
          functionId,
          option: key,
        },
      });
    }
  });
};
