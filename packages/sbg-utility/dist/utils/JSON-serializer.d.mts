/**
 * Parses a JSON string with support for circular references.
 * @param text - The JSON string to parse.
 * @param reviver - Optional function to transform the parsed values.
 * @returns The parsed object.
 */
declare const parse: (text: string, reviver?: (...args: any[]) => any) => any;
/**
 * Stringifies an object into JSON with support for circular references.
 * @param value - The object to stringify.
 * @param replacer - Optional function to transform the values before stringifying.
 * @param space - Optional number or string to use as a white space in the output.
 * @returns The JSON string representation of the object.
 */
declare const stringify: (value: any, replacer?: ((this: any, key: string, value: any) => any) | string[], space?: string | number) => string;
/**
 * Converts an object with circular references to JSON.
 * @param any - The object to convert.
 * @returns The JSON representation of the object.
 */
declare const toJSON: (any: any) => any;
export { toJSON };
/**
 * Parses a circular object from JSON.
 * @param any - The JSON string to parse.
 * @returns The parsed object.
 */
declare const fromJSON: (any: string) => any;
export { fromJSON, parse, stringify };
