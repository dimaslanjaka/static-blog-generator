# API Documentation for src/utils/array.ts

## array_random

### Parameters

- `items`: `T`
- `predicateOrEnsure`: `boolean | ((item: T[number]) => boolean) | undefined`
- `ensureAllPicked`: `boolean`

### Returns

`T[number] | undefined`

## array_unique


Remove duplicate values from an array.

- Without `field`, primitive values are deduplicated with strict equality.
- With `field`, objects are deduplicated by the given property name.
- Empty strings and empty arrays are removed from the result.


### Example

```ts
import { array_unique } from 'sbg-utility';
const values = array_unique(['a', 'a', '', 'b', 'b']);
// ['a', 'b']
```

### Parameters

- `arr`: `T` — array to deduplicate
- `field`: `string | undefined` — optional key name to deduplicate objects by

### Returns

`T`

## array_remove_empty


Remove empty values from an array.

- Empty strings are removed.
- Empty arrays are removed.
- Empty objects are removed.


### Example

```ts
import { array_remove_empty } from 'sbg-utility';

const values = array_remove_empty(['a', '', [], {}, 'b']);
// ['a', 'b']
```

### Parameters

- `arr`: `T` — array to clean

### Returns

`any[]`

## arrayOfObjUniq


Remove duplicate objects by a field name.


### See

https://stackoverflow.com/a/67322087/6404439

### Example

```ts
import { arrayOfObjUniq } from 'sbg-utility';
const values = arrayOfObjUniq(
  [
    { id: 1, name: 'a' },
    { id: 1, name: 'b' },
    { id: 2, name: 'c' }
  ],
  'id'
);
// [{ id: 1, name: 'a' }, { id: 2, name: 'c' }]
```

### Parameters

- `arr`: `T` — array of objects
- `field`: `string` — key name to deduplicate by

### Returns

`T`

## array_shuffle


Shuffle an array by sorting with a random comparator.

Note: this mutates the input array.


### Parameters

- `items`: `T` — array to shuffle (mutated in-place)

### Returns

`T`

## array_shuffle_swap


Fast in-place shuffle using the Fisher–Yates swap method.

Note: this mutates the input array.


### See

https://stackoverflow.com/a/65638217/6404439

### Parameters

- `t`: `T` — array to shuffle (mutated in-place)

### Returns

`void`

## array_flatten


Flatten a nested array.

- Without `depth`, it fully flattens the array recursively to all nested levels.
- With `depth`, it uses the provided flatten depth via `Array.prototype.flat(depth)`.


### Example

```ts
import { array_flatten } from 'sbg-utility';

// fully flatten (no depth provided)
const values = array_flatten([1, [2, [3]]]);
// [1, 2, 3]

// flatten to depth 1
const oneLevel = array_flatten([1, [2, [3]]], 1);
// [1, 2, [3]]
```

### Parameters

- `arr`: `T` — nested array to flatten
- `depth`: `N | undefined` — optional flatten depth (when provided, delegates to `arr.flat(depth)`)

### Returns

`FlatArray<T, N>[]`

