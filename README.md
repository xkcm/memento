# ts-cache
### Description
TypeScript library providing useful caching utilities for functions and class methods.
### Example
```ts
class TestClass{

  @Cacheable({
    keepAlive: 5*1000
  })
  public testMethodOne(){
    return new Date().getSeconds()
  }
}
```
This example shows a method that returns the number of the seconds at the exact moment and caches the result for 5 seconds. If this method gets invoked withing 5 seconds after caching, it will return *cached value*. After 5 seconds the cache value will expire and this function will be invoked again.

`Cacheable` decorator supports only methods of a class, if you'd like to make a `Function` cacheable you have to use `makeCacheable` utility.

```ts
const getSeconds = () => new Date().getSeconds()
const cachedGetSeconds = makeCacheable(getSeconds, {
  keepAlive: 5*1000 // cache the value for only 5 seconds
})
```

You can also use `CacheController` and pass it to the `Cacheable` instance in order to control the caching process.
```ts
const cacheController01 = CacheController.createController()
const cachedGetSeconds = makeCacheable(getSeconds, {
  cacheController: cacheController01
})
cacheController01.resetCache()
```
## Installation
```bash
yarn add ts-cache-utilities
# or if you prefer npm
npm i ts-cache-utilities
```
---
## API
## `@Cacheable(options)`
TypeScript decorator used on class methods.

**Params**
* `options` [**{CacheableConfiguration}**](#cacheableconfiguration): (required) Configuration of the cache instance (see [**Interfaces**](#interfaces))

**Return value**

`@Cacheable()` returns decorated method.

**Example**
```ts
class ExampleClass {

  @Cacheable({ keepAlive: 30*1000, cacheController: cacheController01, key: "custom-key" })
  public exampleMethod(){
    return Date.now()
  }

}
```

## [`makeCacheable(callback, options)`](src/utilities/MakeCacheable.ts)
Utility that makes a given function cacheable.

**Params**
* `callback` **{Function}**: (required) Function with return value that will be cached.
* `options` [**{CacheableConfiguration}**](#cacheableconfiguration): (required) Configuration of the cache instance (see [**Interfaces**](#interfaces))

**Return value**

A new function that invokes the original function and caches its return value. This function also contains metadata about the cache instance, which you can access by `.cacheMetadata`.

**Example**
```ts
const exampleFunction = () => Date.now()
const cachedFunction = makeCacheable(exampleFunction, {
  key: "some-other-custom-key"
})
cachedFunction()
// accessing metadata
const meta = cachedFunction.cacheMetadata
```

## [`CacheController`](src/utilities/CacheController.ts)
`CacheController` is used to control the cache instances.
### [`CacheController#resetCache(keys...)`](src/utilities/CacheController.ts#L15)
Resets the cache values in all the controlled cache instances.

**Params**
* `keys...` **{string[]}**: (required) keys of the cache instances to be reset

**Return value**

`boolean` (`true` if reset was successful, `false` otherwise)

**Example**
```ts
cacheController01.resetCache("key-01", "key-02")
```

### [`CacheController#controlledCache()`](src/utilities/CacheController.ts#L19)
Returns an array of all controlled cache keys.

**Params**

`CacheController#controlledCache()` takes no parameters.

**Return value**

`string[]`

**Example**

```ts
const cacheKeys = cacheController01.controlledCache()
```

### [`CacheController#registerSelf(key, options)`](src/utilities/CacheController.ts#L22)
Registers new cache instance. This method gets invoked inside of `@Cacheable()` decorator and `makeCacheable` function, you shouldn't invoke it by hand.

**Params**
* `key` **{string}**: (required) Key of the cache instance to be registered
* `options` [**{CacheInstanceInfo}**](#cacheinstanceinfo): (required) Options for the cache instance

**Return value**

`boolean` (`true` if registered successfully, `false` otherwise)

**Example**
```ts
cacheController01.registerSelf("some-key", {
  type: "function",
  invokerName: "getSeconds",
  cachingStartedAt: 1636042487387
})
```

### [`CacheController#getInfo(key)`](src/utilities/CacheController.ts#L27)
Returns information about cache instance by given key.

**Params**
* `key` **{string}**: (required) Cache instance key

**Return value**

[`CacheInstanceInfo`](#cacheinstanceinfo)

**Example**
```ts
const someKeyInfo: CacheInstanceInfo = cacheController01.getInfo("some-key")
```

### [`CacheController#unlinkKey(key)`](src/utilities/CacheController.ts#L30)
Unlinks the cache instance key from the controller.

**Params**
* `key` **{string}**: (required) Cache instance key

**Return value**

`boolean` (`true` if unlinked successfully, `false` otherwise)

**Example**
```ts
cacheController01.unlinkKey("some-key")
```

## [`Storage`](src/utilities/CacheStorage.ts)
Storage for cached values, you can access some of its methods.

### [`Storage#isKeyAvailable(key)`](src/utilities/CacheStorage.ts#L29)
Checks if the given `key` is already registered.

**Params**
* `key` **{string}**: (required) Key value

**Return value**

`boolean` (`true` if available, `false` otherwise)

**Example**
```ts
const isAvailable = Storage.isKeyAvailable("some-custom-key")
```

### [`Storage#registeredKeys()`](src/utilities/CacheStorage.ts#L26)
Returns an array of keys of registered cache instances.

**Params**

`Storage#registeredKeys()` takes no parameters.

**Return value**

`string[]`

**Example**
```ts
const keys: string[] = Storage.registeredKeys()
```

### [`Storage#modifyItem(key, modifier)`](src/utilities/CacheStorage.ts#L17)
Modifies stored item.

**Params**
* `key` **{string}**: (required) Cache instance key.
* `modifier` **{(value: T) => T}**: (required) Callback that receives item value as parameter and returns value of the same type.

**Example**
```ts
Storage.modifyItem("some-custom-key", (value: number) => {
  const newValue = value*2
  return newValue
})
```

## [`Storage#getItem(key)`](src/utilities/CacheStorage.ts#L4)
Returns a value of the stored item by given key.

**Params**
* `key` **{string}**: (required) Cache instance key.

**Return value**

Cached value

**Example**
```ts
const value = Storage.getItem("some-custom-key")
```


## Interfaces
### `CacheInstanceInfo`
Contains information about cache instance.

```ts
interface CacheInstanceInfo {
  type: "method" | "function";
  invokerName: string;
  cachingStartedAt: number;
  className?: string;
}
```
* `type` *(required)* - Type of the cached function.
* `invokerName` *(required)* - Name of the cached function.
* `cachingStartedAt` *(required)* - Timestamp when caching started.
* `className?` *(optional)* - Name of the class if type of the cached function is "method".

### `CacheableConfiguration`
Contains configuration when initializing new cache instance.

```ts
interface CacheableConfiguration {
  keepAlive?: number;
  cacheController?: CacheController;
  key?: string;
}
```
* `keepAlive` *(optional, default = Infinity)* - Time (in miliseconds) after the cached value expires.
* `cacheController` *(optional, default = CacheController.default)* - `CacheController` instance.
* `key` *(optional, default = random UUID)* - Custom cache instance key used to identify the instance.
