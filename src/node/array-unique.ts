export function uniqueArray<T extends any[]>(array: T) {
  for (var i = 0; i < array.length; i++) {
    for (var j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        array.splice(j, 1);
      }
    }
  }
  return array;
}
export default uniqueArray;