/**
 * Pick a random item from an array.
 *
 * Behavior:
 * - `array_random(items)` returns a random item.
 * - `array_random(items, true)` returns each item once before repeating any item.
 * - `array_random(items, predicate)` returns a random item that matches the predicate (or `undefined` if none match).
 * - `array_random(items, predicate, true)` returns each matching item once before repeating.
 *
 * @param items array to pick from
 * @param predicateOrEnsure optional predicate to filter candidates or boolean to enable `ensureAllPicked`
 * @param ensureAllPicked when true, picks unpicked candidates first; after all are picked at least once, falls back to normal random behavior
 * @returns a random item that satisfies predicate or undefined if none (only when predicate is provided)
 * @example
 * import { array_random } from 'sbg-utility';
 *
 * // simple random
 * const a = array_random(['a', 'b', 'c']);
 *
 * // ensure each item is returned once before repeats
 * const b = array_random(['a', 'b', 'c'], true);
 *
 * // with predicate
 * const c = array_random([1, 2, 3, 4], (n) => n % 2 === 0);
 */
export function array_random<T extends any[]>(items: T): T[number];
export function array_random<T extends any[]>(items: T, ensureAllPicked: boolean): T[number];
export function array_random<T extends any[]>(items: T, predicate: (item: T[number]) => boolean): T[number] | undefined;
export function array_random<T extends any[]>(
  items: T,
  predicate: (item: T[number]) => boolean,
  ensureAllPicked: boolean
): T[number] | undefined;
export function array_random<T extends any[]>(
  items: T,
  predicateOrEnsure?: ((item: T[number]) => boolean) | boolean,
  ensureAllPicked = false
): T[number] | undefined {
  if (!Array.isArray(items)) throw new Error('array param must be instance of ARRAY');

  const predicate = typeof predicateOrEnsure === 'function' ? predicateOrEnsure : undefined;
  const shouldEnsureAllPicked = typeof predicateOrEnsure === 'boolean' ? predicateOrEnsure : ensureAllPicked;

  let candidateIndexes: number[];
  if (typeof predicate !== 'function') {
    if (items.length === 0) throw new Error('items must be a non-empty array when no predicate is provided');
    candidateIndexes = items.map((_, index) => index);
  } else {
    candidateIndexes = [];
    for (let index = 0; index < items.length; index++) {
      if (predicate(items[index])) candidateIndexes.push(index);
    }
    if (candidateIndexes.length === 0) return undefined as any;
  }

  if (shouldEnsureAllPicked) {
    let pickedIndexes = __array_random_picked_indexes.get(items);
    if (!pickedIndexes) {
      pickedIndexes = new Set<number>();
      __array_random_picked_indexes.set(items, pickedIndexes);
    }

    const unpickedCandidateIndexes = candidateIndexes.filter((index) => !pickedIndexes.has(index));
    if (unpickedCandidateIndexes.length > 0) {
      const index = unpickedCandidateIndexes[Math.floor(Math.random() * unpickedCandidateIndexes.length)];
      pickedIndexes.add(index);
      return items[index];
    }
  }

  return items[candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)]];
}

const __array_random_picked_indexes = new WeakMap<any[], Set<number>>();

/**
 * Remove duplicate values from an array.
 *
 * - Without `field`, primitive values are deduplicated with strict equality.
 * - With `field`, objects are deduplicated by the given property name.
 * - Empty strings and empty arrays are removed from the result.
 *
 * @param arr array to deduplicate
 * @param field optional key name to deduplicate objects by
 * @returns deduplicated array with empty strings/arrays removed
 * @example
 * import { array_unique } from 'sbg-utility';
 * const values = array_unique(['a', 'a', '', 'b', 'b']);
 * // ['a', 'b']
 *
 * @link https://stackoverflow.com/a/67322087/6404439
 */
export function array_unique<T extends any[]>(arr: T, field?: string): T {
  if (Array.isArray(arr)) {
    if (typeof field !== 'string') {
      arr = arr.filter(function (x, i, a) {
        return a.indexOf(x) === i;
      }) as T;
    } else {
      arr = arr.filter((a, i) => arr.findIndex((s) => a[field] === s[field]) === i) as T;
    }
    return arr.filter((item) => {
      if (typeof item === 'string') return item.trim().length > 0;
      if (Array.isArray(item)) return item.length > 0;
      return true;
    }) as T;
  } else {
    throw new Error('array param must be instance of ARRAY');
  }
}

/**
 * Remove empty values from an array.
 *
 * - Empty strings are removed.
 * - Empty arrays are removed.
 * - Empty objects are removed.
 *
 * @param arr array to clean
 * @returns filtered array with empties removed
 * @example
 * import { array_remove_empty } from 'sbg-utility';
 *
 * const values = array_remove_empty(['a', '', [], {}, 'b']);
 * // ['a', 'b']
 */
export function array_remove_empty<T extends any[]>(arr: T) {
  return arr.filter((target) => {
    if (typeof target === 'string') return target.trim().length > 0;
    if (Array.isArray(target)) return target.length > 0;
    if (typeof target === 'object') return Object.keys(target).length > 0;
    return true;
  });
}

/**
 * Remove duplicate objects by a field name.
 *
 * @param arr array of objects
 * @param field key name to deduplicate by
 * @returns filtered array with unique objects by `field`
 * @see {@link https://stackoverflow.com/a/67322087/6404439}
 * @example
 * import { arrayOfObjUniq } from 'sbg-utility';
 * const values = arrayOfObjUniq(
 *   [
 *     { id: 1, name: 'a' },
 *     { id: 1, name: 'b' },
 *     { id: 2, name: 'c' }
 *   ],
 *   'id'
 * );
 * // [{ id: 1, name: 'a' }, { id: 2, name: 'c' }]
 */
export function arrayOfObjUniq<T extends any[]>(arr: T, field: string): T {
  //console.log(array);
  if (!Array.isArray(arr)) {
    throw new Error('array param must be instance of ARRAY');
  }
  return <any>arr.filter((a, i) => arr.findIndex((s) => a[field] === s[field]) === i);
}

/**
 * Shuffle an array by sorting with a random comparator.
 *
 * Note: this mutates the input array.
 *
 * @param items array to shuffle (mutated in-place)
 * @returns the shuffled array
 */
export function array_shuffle<T extends any[]>(items: T): T {
  return items.sort(() => Math.random() - 0.5);
}

/**
 * Generate a random integer between 0 (inclusive) and `n` (exclusive).
 *
 * Uses a bitwise OR to coerce the floating point to an integer.
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param n upper bound (exclusive)
 * @returns integer in the range [0, n)
 */
export const rand = (n: number) => 0 | (Math.random() * n);

/**
 * Fast shuffle helper (internal).
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param t array to swap elements in
 * @param i index
 * @param j index
 */
function swap<T extends any[]>(t: T, i: number, j: number) {
  const q = t[i];
  t[i] = t[j];
  t[j] = q;
  return t;
}

/**
 * Fast in-place shuffle using the Fisher–Yates swap method.
 *
 * Note: this mutates the input array.
 *
 * @param t array to shuffle (mutated in-place)
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 */
export function array_shuffle_swap<T extends any[]>(t: T) {
  let last = t.length;
  let n;
  while (last > 0) {
    n = rand(last);
    swap(t, n, --last);
  }
}

/**
 * Flatten a nested array.
 *
 * - Without `depth`, it fully flattens the array recursively to all nested levels.
 * - With `depth`, it uses the provided flatten depth via `Array.prototype.flat(depth)`.
 *
 * @param arr nested array to flatten
 * @param depth optional flatten depth (when provided, delegates to `arr.flat(depth)`)
 * @returns flattened array
 * @example
 * import { array_flatten } from 'sbg-utility';
 *
 * // fully flatten (no depth provided)
 * const values = array_flatten([1, [2, [3]]]);
 * // [1, 2, 3]
 *
 * // flatten to depth 1
 * const oneLevel = array_flatten([1, [2, [3]]], 1);
 * // [1, 2, [3]]
 */
export function array_flatten<T extends any[], N extends number = 1>(arr: T, depth?: N): FlatArray<T, N>[] {
  if (typeof depth === 'number') return arr.flat(depth);
  return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? array_flatten(cur) : cur), []);
}
