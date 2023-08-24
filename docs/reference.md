# Reference
This page contains detailed info about the library's design and its features. Sections:
* [Design](#design)
  * [Identification](#identification)
  * [Storage interface](#storage-interface)
  * [Asynchronous Memento Controller](#asynchronous-memento-controller)
* [Custom Storage](#custom-storage)
* [API](#api)
  * [Memento](#memento)
  * [MementoController](#memento-controller)
  * [Utils](#utils)
    * [extractMemoizationMetadata](#extractmemoizationmetadata)
    * [memoize](#memoize-1)

## Design
### Identification
For each memoized function the library generates a unique identifier.
By default, the library generates the function ID from the function's name and an uuid, which guarantees its uniqueness.
When the memoized function is invoked, an arguments identifier is created from the passed arguments.
This pair of identifiers is used to identify memoization values in the Storage interface.

By default, the library generates the arguments ID by stringifying the arguments and hashing the result using the SHA256 algorithm, which guarantees its uniqueness and small size. This approach has 2 flaws:
* function arguments are not recognized
* circular structure arguments will cause an error

> For a specific use case it's possible to define a custom `buildArgumentsId` function and pass it to the `.memoize` method. Read more about the `Memento` methods in [Memento](#memento) section.

### Storage interface
Memento supports both asynchronous and synchronous Storages, the returned type of the memoized function is correctly inferred from the Storage interface that is used.

For example: if the storage is asynchronous (e.g. [`RedisStorage`](#redis-storage)), TypeScript knows the memoized function will return a `Promise`, even if the original function is synchronous.

### Asynchronous Memento Controller
`MementoController` methods need to be asynchronous, because there's no way to determine if linked memoized functions use synchronous storages or asynchronous. The best approach is to assume every storage is asynchronous, which makes the `MementoController` asynchronous too.

## Custom Storage
Memento supports two types of custom storages:
* `Storage` - synchronous storage
* `AsyncStorage` - asynchronous storage

To create a custom storage class, it needs to implement one of the Storage types and include a `type` property set to `async` or `sync` accordingly.

> Implementing `Storage` type is required for TypeScript to correctly infer the memoized function return type, and the `type` property is required to determine the returned value at a runtime.

Example of synchronous storage class:

```typescript
import { Storage, MemoizationEntry } from "@xkcm/memento";

export class ExampleSyncStorage implements Storage {
  type = "sync" as const;

  protected memoizationObject: Record<string, any> = {};

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
```

**Storage** interface
```typescript
interface Storage {
  type: "sync";
  set(functionId: string, argsId: string, value: MemoizationEntry): void;
  get<T>(functionId: string, argsId: string): MemoizationEntry<T> | undefined;
  clear(functionId: string, argsId?: string): void;
}
```

**AsyncStorage** interface
```typescript
export interface AsyncStorage {
  type: "async";
  set(functionId: string, argsId: string, value: MemoizationEntry): Promise<void>;
  get<T>(functionId: string, argsId: string): Promise<MemoizationEntry<T> | undefined>;
  clear(functionId: string, argsId?: string): Promise<void>;
}
```

## API

### Memento
`Memento` serves as a container for memoization configuration.

#### constructor
```typescript
class Memento {
  constructor(options?: MementoConstructorOptions) {
    /* ... */
  }
}
```

Supported constructor options:
* `ttl` - Time To Live, time after a memoization entry is considered invalid, if set to `-1` entry never expires
* `storage` - Storage interface to store the memoization values
* `controller` - optional memoization controller
* `buildFunctionId` - optional custom function for creating function identifiers
* `buildArgumentsId` - optional custom function for creating arguments identifiers
* `isMemoizationEntryValid` - optional custom function for validating memoization entries

```typescript
type MementoConstructorOptions = {
  ttl: number;

  storage: AsyncStorage | Storage,

  controller?: MementoController;

  buildFunctionId?: (fn: (...args: any[]) => any) => string;

  buildArgumentsId?: (args: any[]) => string;

  isMemoizationEntryValid?: (
    entry: {
      timestamp: number;
      value: any;
    },
    options: {
      ttl: number;
    },
  ) => boolean;
};
```

#### memoize
`memoize` method is used for memoizing functions with the memoization configuration passed in the constructor. It also accepts `overrideOptions` parameter.
Parameters:
* `fn` - function to memoize
* `overrideOptions` - optional object with memoization configuration

```typescript
class Memento {
  memoize(
    fn: (...args: any[]) => any,
    overrideOptions?: OverrideOptions
  ) {
    /* ... */
  }
}
```

Supported override options:
* all options from the Memento constructor options object, optional
* `functionId` - optional custom function identifier

```typescript
type OverrideMemoizeOptions = Partial<MementoConstructorOptions> & {
  functionId?: string;
}
```

### MementoController
`MementoController` is used for invalidating the memoization storage. To use it, link it in the [`Memento#constructor`](#constructor) or [`Memento#memoize`](#memoize) options.

#### constructor
`MementoController` constructor takes no arguments.
```typescript
class MementoController {
  constructor() {
    /* ... */
  }
}
```

#### invalidateAll
`invalidateAll` invalidates all linked memoized functions. This method takes no arguments and returns a `Promise`.
```typescript
class MementoController {
  async invalidateAll(): Promise<void> {
    /* ... */
  }
}
```

#### invalidate
`invalidate` invalidates specific memoized function. This method returns a `Promise` and takes 1-2 arguments:
* `functionId` - function identifier
* `argsId` - optional arguments identifier, if passed only a specific Memoization Entry gets invalidated

```typescript
class MementoController {
  async invalidate(functionId: string, argsId?: string): Promise<void> {
    /* ... */
  }
}
```

### Storages
#### MemoryStorage
In-memory synchronous storage. Used by default by Memento class.
#### RedisStorage
Redis asynchronous storage, takes Redis client as a constructor argument.

### Utils
#### extractMemoizationMetadata
Typed utility function for extracting memoization metadata from a memoized function.
```typescript
const extractMemoizationMetadata = (fn: MemoizedFunction) => { /* ... */ }
```

This function takes a memoized function as an argument and returns a `MemoizationMetadata` object.

```typescript
type MemoizationMetadata = Readonly<{
  ttl: number,
  functionId: string;
  storage: Storage | AsyncStorage;
  buildArgumentsId: (args: any[]) => string;
  controller?: MementoController;
}>
```

#### memoize
Utility function for a quick and simple memoization.

```typescript
const memoize = (
  fn: (...args: any[]) => any,
  options: MementoConstructorOptions & {
    functionId?: string;
  },
) => { /* ... */ }

```
