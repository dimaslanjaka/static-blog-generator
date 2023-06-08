/**
 * pick random items from array
 * @param items
 * @returns
 */
export function array_random<T extends any[]>(items: T): T[number] {
  return items[Math.floor(Math.random() * items.length)];
}

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
