import * as serializer from './JSON-serializer';

declare global {
  interface JSON {
    /**
     * @see {@link https://stackoverflow.com/a/61962964/6404439}
     * @example
     * console.log(JSON.stringify({a:{a:{a:{a:[{a:{hello:"world"}}]}}}}))
     */
    stringifyWithCircularRefs: (obj: any, space?: number) => string;
  }
}

JSON.stringifyWithCircularRefs = serializer.toJSON;

/**
 * transform any object to json. Suppress `TypeError: Converting circular structure to JSON`
 * @param data
 * @returns
 */
export function jsonStringifyWithCircularRefs(data: any) {
  return serializer.stringify(data);
}

/**
 * parse json stringified with circular refs
 */
export function jsonParseWithCircularRefs<T>(data: string) {
  return serializer.parse(data) as T;
}
