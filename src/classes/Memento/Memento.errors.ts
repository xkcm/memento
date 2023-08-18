/* eslint-disable max-classes-per-file */
import {
  BetterError,
  withCode,
  withMessage,
} from "@xkcm/better-errors";

@withMessage("Memento constructor requires \"%{metadata.option}\" option")
@withCode("memento.constructor_option_required")
export class ConstructorOptionRequiredError extends BetterError<{ option: string; }> { }

@withMessage("Unable to memoize function \"%{metadata.functionId}\", missing option \"%{metadata.option}\"")
@withCode("memento.memoize_option_required")
export class MemoizeOptionRequiredError extends BetterError<{
  functionId: string;
  option: string;
}> { }
