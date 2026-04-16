# Array Helpers

## `array_random(items, ensureAllPicked?)`

Pick a random item from an array.

- `array_random(items)` returns a random item
- `array_random(items, true)` returns each item once before repeating any item
- `array_random(items, predicate)` returns a random item that matches the predicate
- `array_random(items, predicate, true)` returns each matching item once before repeating

Example:

```ts
import { array_random } from 'sbg-utility';

const value = array_random(['a', 'b', 'c'], true);
```

## `array_unique(arr, field?)`

Remove duplicate values from an array.

- Without `field`, primitive values are deduplicated with strict equality
- With `field`, objects are deduplicated by the given property name
- Empty strings and empty arrays are removed from the result

Example:

```ts
import { array_unique } from 'sbg-utility';

const values = array_unique(['a', 'a', '', 'b', 'b']);
// ['a', 'b']
```

## `array_remove_empty(arr)`

Remove empty values from an array.

- Empty strings are removed
- Empty arrays are removed
- Empty objects are removed

Example:

```ts
import { array_remove_empty } from 'sbg-utility';

const values = array_remove_empty(['a', '', [], {}, 'b']);
// ['a', 'b']
```

## `arrayOfObjUniq(arr, field)`

Remove duplicate objects by a field name.

Example:

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

## `array_shuffle(items)`

Shuffle an array by sorting with a random comparator.

Note: this mutates the input array.

## `array_shuffle_swap(items)`

Shuffle an array in place using the swap-based algorithm.

Note: this mutates the input array.

## `array_flatten(arr, depth?)`

Flatten a nested array.

- Without `depth`, it flattens one level
- With `depth`, it uses the provided flatten depth

Example:

```ts
import { array_flatten } from 'sbg-utility';

const values = array_flatten([1, [2, [3]]]);
// [1, 2, [3]]
```

## `rand(n)`

Generate a random integer from `0` up to, but not including, `n`.

Example:

```ts
import { rand } from 'sbg-utility';

const value = rand(10);
```
