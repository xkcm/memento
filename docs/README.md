# Home
Memento is a simple, well-typed memoization library built with TypeScript. 

# Overview
This library supports:
* memoizing both async and sync functions
* invalidating memoized values
* writing custom storage interfaces for storing memoized results

Read more about the library's architecture on the [Reference](reference.md) page

# Installation
To use Memento install the `@xkcm/memento` package from NPM registry
```bash
pnpm add @xkcm/memento # pnpm
npm add @xkcm/memento # npm
yarn add @xkcm/memento # yarn
```

# Examples

Memoizing simple synchronous function using in-memory storage
```typescript
import { Memento, MemoryStorage } from "@xkcm/memento";

const memento = new Memento({
  ttl: 60_000, // 1 minute
  storage: new MemoryStorage(),
});

const func = () => Math.random();
const memoizedFunc = memento.memoize(func);
```
---
Overriding `Memento` configuration
```typescript
import { Memento, MemoryStorage } from "@xkcm/memento";

const memento = new Memento({
  ttl: 60_000, // 1 minute
  storage: new MemoryStorage(),
});

const func = () => Date.now();
const memoizedFunc = memento.memoize(func, {
  ttl: 15_000, // 15s
  buildFunctionId: (fn) => `${fn.name}_${Math.random()}`,
});
```
---
Using `Memento Controller` to invalidate function's memoized values
```typescript
import {
  Memento,
  MemoryStorage,
  MementoController,
} from "@xkcm/memento";

const controller = new MementoController();
const memento = new Memento({
  ttl: 60_000, // 1 minute
  storage: new MemoryStorage(),
  controller, // linking the controller to the Memento instance
});

const functionId = "random_num"; // custom function id
const func = () => Math.random();
const memoizedFunc = memento.memoize(func, { functionId });

// Invalidating by specific function id
await controller.invalidate(functionId);

// Invalidating all controlled memoized functions
await controller.invalidateAll();
```
---
Advanced example of extracting metadata from a memoized function, and invalidating by specific arguments
```typescript
import {
  Memento,
  MemoryStorage,
  MementoController,
  extractMemoizationMetadata,
} from "@xkcm/memento";

const controller = new MementoController();
const memento = new Memento({
  ttl: 60_000, // 1 minute
  storage: new MemoryStorage(),
  controller,
});

const func = (a: number, b: number) => {
  console.info("Hello from func!");
  return a + b;
};
const memoizedFunc = memento.memoize(func);

memoizedFunc(3, 4); // logs "Hello from func!"
memoizedFunc(3, 4); // returned from the memoization storage, no log message
memoizedFunc(5, 4); // logs "Hello from func!"

const { buildArgumentsId, functionId } = extractMemoizationMetadata(memoizedFunc)

// Invalidating memoizedFunc only for arguments [3, 4]
await controller.invalidate(functionId, buildArgumentsId([3, 4]))
memoizedFunc(3, 4); // logs "Hello from func!"
```