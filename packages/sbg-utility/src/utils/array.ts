/**
 * pick random item from array, optional predicate to filter candidates
 * @param items array to pick from
 * @param predicate optional function to filter items; should return true for allowed items
 * @param ensureAllPicked when true, picks unpicked candidates first; after all are picked at least once, falls back to normal random behavior
 * @returns a random item that satisfies predicate or undefined if none (only when predicate is provided)
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
 * unique array
 * * array of string,number
 * * array of object by object key
 * @param arr
 * @param field key name (for array of object)
 * @returns
 *
 * @example
 * arrayOfObjUniq({p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
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
 * Remove empties from array
 * @param arr
 * @returns
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
 * unique array of object by object key
 * @param arr
 * @param field key name
 * @returns
 * @see {@link https://stackoverflow.com/a/67322087/6404439}
 * @example
 * const arrobj = [{p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}],
 * arrayOfObjUniq(arrobj, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
 */
export function arrayOfObjUniq<T extends any[]>(arr: T, field: string): T {
  //console.log(array);
  if (!Array.isArray(arr)) {
    throw new Error('array param must be instance of ARRAY');
  }
  return <any>arr.filter((a, i) => arr.findIndex((s) => a[field] === s[field]) === i);
}

/**
 * array shuffler
 * @param items
 * @returns
 */
export function array_shuffle<T extends any[]>(items: T): T {
  return items.sort(() => Math.random() - 0.5);
}

/**
 * generate random number
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param n
 * @returns
 */
export const rand = (n: number) => 0 | (Math.random() * n);

/**
 * fast shuffle array (internal)
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param t
 */
function swap<T extends any[]>(t: T, i: number, j: number) {
  const q = t[i];
  t[i] = t[j];
  t[j] = q;
  return t;
}

/**
 * fast shuffle array using swap method
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param t
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
 * flattern array
 * @param arr
 * @returns
 */
export function array_flatten<T extends any[], N extends number = 1>(arr: T, depth?: N): FlatArray<T, N>[] {
  if (typeof depth === 'number') return arr.flat(depth);
  return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? array_flatten(cur) : cur), []);
}
