import { v4 as generateUUID } from "uuid";

import { AsyncStorage, Storage } from "../../types";
import { FunctionAlreadyRegisteredError, UnregisteredFunctionError } from "./MementoController.errors";

export default class MementoController {
  public id = generateUUID();

  protected storages = new Map<string, Storage | AsyncStorage>();

  public async invalidateAll() {
    return Promise.all([...this.storages.keys()].map((fnId) => this.invalidate(fnId)));
  }

  public async invalidate(functionId: string, argsId?: string): Promise<void> {
    if (!this.storages.has(functionId)) {
      throw new UnregisteredFunctionError({
        metadata: {
          functionId,
          controllerId: this.id,
        },
      });
    }

    const functionStorage = this.storages.get(functionId)!;
    return functionStorage.clear(functionId, argsId);
  }

  public register(functionId: string, storage: Storage | AsyncStorage) {
    if (this.storages.has(functionId)) {
      throw new FunctionAlreadyRegisteredError({
        metadata: {
          functionId,
          controlledId: this.id,
        },
      });
    }

    this.storages.set(functionId, storage);
  }
}
