/* eslint-disable max-classes-per-file */
import {
  BetterError,
  withCode,
  withMessage,
} from "@xkcm/better-errors";

@withMessage("Function with id \"%{metadata.functionId}\" is already registered in Memento Controller with id \"%{metadata.controllerId}\"")
@withCode("memento.controller.function_already_registered")
export class FunctionAlreadyRegisteredError extends BetterError<{
  functionId: string;
  controlledId: string;
}> { }

@withMessage("Function with id\"%{metadata.functionId}\" is not registered in Memento Controller with id \"%{metadata.controllerId}\"")
@withCode("memento.controller.unregistered_function")
export class UnregisteredFunctionError extends BetterError<{
  functionId: string;
  controllerId: string;
}> { }
