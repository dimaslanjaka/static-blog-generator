# API Documentation for src/utils/deepMerge.ts

## deepMerge


Deeply merges two values, handling arrays, objects, and special types.

- If both values are arrays, merges by index, unions nested arrays, and merges objects/maps/sets/functions at the same index.
- If both values are objects, merges properties recursively, handling special types (`Date`, `Map`, `Set`, `RegExp`, `Function`).
- If types differ, source replaces target.
- Handles circular references.


### Parameters

- `target`: `Partial<T> | null | undefined` — - The target value to merge into.
- `source`: `Partial<S> | null | undefined` — - The source value to merge from.
- `seen`: `WeakMap<WeakKey, any>` — - Internal WeakMap to track circular references.

### Returns

`T & S`

