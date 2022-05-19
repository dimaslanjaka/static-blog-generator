export function uniqueArray<T extends any[]>(array: T) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        array.splice(j, 1);
      }
    }
  }
  return array;
}
/**
 * Unique Array Of Strings
 * @param arr
 * @returns
 */
export function uniqueStringArray(arr: Array<string>) {
  const filter = new Map(arr.map((s) => [s.toLowerCase(), s]));
  return [...filter.values()];
}
export default uniqueArray;
