/* eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }] */
'use strict';
/*! (c) 2020 Andrea Giammarchi */
/* https://github.com/WebReflection/flatted/blob/main/cjs/index.js */

const { parse: $parse, stringify: $stringify } = JSON;
const { keys } = Object;

const Primitive = String; // It could be Number
const primitive = 'string'; // It could be 'number'

const ignore = {};
const object = 'object';

const noop = (_: unknown, value: unknown) => value;

const primitives = (value: unknown) => (value instanceof Primitive ? Primitive(value) : value);

const Primitives = (_: unknown, value: unknown) => (typeof value === primitive ? new Primitive(value) : value);

/**
 * Recursively revives circular references in a parsed object.
 */
const revive = (input: any[], parsed: Set<any>, output: any, $: (key: string, value: any) => any): any => {
  const lazy = [] as any[];
  for (let ke = keys(output), { length } = ke, y = 0; y < length; y++) {
    const k = ke[y];
    const value = output[k];
    if (value instanceof Primitive) {
      const tmp = input[value as any];
      if (typeof tmp === object && !parsed.has(tmp)) {
        parsed.add(tmp);
        output[k] = ignore;
        lazy.push({ k, a: [input, parsed, tmp, $] });
      } else output[k] = $.call(output, k, tmp);
    } else if (output[k] !== ignore) output[k] = $.call(output, k, value);
  }
  for (let { length } = lazy, i = 0; i < length; i++) {
    const { k, a } = lazy[i];
    // eslint-disable-next-line prefer-spread
    output[k] = $.call(output, k, revive.apply(null, a));
  }
  return output;
};

/**
 * Adds a value to a set of known values and returns its index.
 */
const set = (known: Map<any, any>, input: any[], value: any): string => {
  const index = Primitive(input.push(value) - 1);
  known.set(value, index);
  return index;
};

/**
 * Parses a JSON string with support for circular references.
 * @param text - The JSON string to parse.
 * @param reviver - Optional function to transform the parsed values.
 * @returns The parsed object.
 */
const parse = (text: string, reviver?: (...args: any[]) => any): any => {
  const input = $parse(text, Primitives).map(primitives);
  const value = input[0];
  const $ = reviver || noop;
  const tmp = typeof value === object && value ? revive(input, new Set(), value, $) : value;
  return $.call({ '': tmp }, '', tmp);
};

/**
 * Stringifies an object into JSON with support for circular references.
 * @param value - The object to stringify.
 * @param replacer - Optional function to transform the values before stringifying.
 * @param space - Optional number or string to use as a white space in the output.
 * @returns The JSON string representation of the object.
 */
const stringify = (
  value: any,
  replacer?: ((this: any, key: string, value: any) => any) | string[],
  space?: string | number
): string => {
  const isCallable = typeof replacer === 'function';
  const $ = isCallable
    ? replacer
    : typeof replacer === 'object'
      ? (k: string, v: any) => (k === '' || replacer.indexOf(k) !== -1 ? v : void 0)
      : noop;
  const known = new Map<any, any>();
  const input: any[] = [];
  const output: string[] = [];
  let i = +set(known, input, $.call({ '': value }, '', value));
  let firstRun = !i;
  while (i < input.length) {
    firstRun = true;
    output[i] = $stringify(input[i++], replace, space);
  }
  return '[' + output.join(',') + ']';

  function replace(this: any, key: string, value: any): any {
    if (firstRun) {
      firstRun = false;
      return value;
    }
    const after = $.call(this, key, value);
    switch (typeof after) {
      case object:
        if (after === null) return after;
      // break omitted
      case primitive:
        return known.get(after) || set(known, input, after);
    }
    return after;
  }
};

/**
 * Converts an object with circular references to JSON.
 * @param anyData - The object to convert.
 * @returns The JSON representation of the object.
 */
const toJSONBrowser = (anyData: any): any => $parse(stringify(anyData));
export { toJSONBrowser };

/**
 * Parses a circular object from JSON.
 * @param anyData - The JSON string to parse.
 * @returns The parsed object.
 */
const fromJSONBrowser = (anyData: string): any => parse($stringify(anyData));
export { fromJSONBrowser, parse as parseBrowser, stringify as stringifyBrowser };

/**
 * transform any object to json. Suppress `TypeError: Converting circular structure to JSON`
 * @param data
 * @returns
 */
/**
 * Transforms any object to JSON, suppressing `TypeError: Converting circular structure to JSON` (Browser version)
 * @param data - The object to stringify
 * @returns The JSON string representation
 */
export function jsonStringifyWithCircularRefsBrowser(data: unknown): string {
  return stringify(data);
}

/**
 * parse json stringified with circular refs
 */
/**
 * Parses JSON stringified with circular refs (Browser version)
 * @param data - The JSON string to parse
 * @returns The parsed object
 */
export function jsonParseWithCircularRefsBrowser<T>(data: string): T {
  return parse(data) as T;
}
