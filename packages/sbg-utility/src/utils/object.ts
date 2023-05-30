/**
 * sort alphabetically object by key
 * @param obj
 * @returns
 */
export function orderKeys<T extends Record<string, any>>(obj: Record<string, any>) {
  const keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
    if (k1 < k2) return -1;
    else if (k1 > k2) return +1;
    else return 0;
  });

  const after = {} as Record<string, any>;
  for (let i = 0; i < keys.length; i++) {
    after[keys[i]] = obj[keys[i]];
    delete obj[keys[i]];
  }

  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = after[keys[i]] as any;
  }
  return obj as T;
}

/**
 * get object property by key, supress typescript error
 * @param item
 * @param key
 * @returns
 */
export function getObjectProperty(item: Record<string, any>, key: string) {
  if (typeof item === 'undefined' || item === null) return;
  if (key in item) return item[key];
}
