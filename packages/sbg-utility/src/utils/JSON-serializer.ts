/* eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }] */
'use strict';
/*! (c) 2020 Andrea Giammarchi */
/* https://github.com/WebReflection/flatted/blob/main/cjs/index.js */

import * as crypto from 'crypto';
import fs from 'fs-extra';
import url from 'node:url';
import path from 'path';
import Logger from './logger';

const __filename = url.fileURLToPath(import.meta.url);
const { parse: $parse, stringify: $stringify } = JSON;
const { keys } = Object;

/**
 * Generates an SHA-1 hash from the provided data.
 * @param data - The input data to hash.
 * @returns The SHA-1 hash of the data.
 */
function sha1(data: string | Buffer): string {
  return crypto.createHash('sha1').update(data.toString(), 'binary').digest('hex');
}

/**
 * Retrieves the current stack trace and creates an error log file.
 * @returns An object containing the stack trace and the file path.
 */
function getStack(): { stack: string[]; file: string } {
  const stack =
    new Error('get caller').stack
      ?.split(/\r?\n/gim)
      .filter((str) => /(dist|src)/i.test(str) && !str.includes(__filename)) ?? [];
  const folder = path.join(process.cwd(), 'tmp/error/json-serializer');
  // Create folder if it does not exist
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  const file = path.join(folder, `${sha1(stack[1])}.log`);
  return { stack, file };
}

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
  try {
    const input = $parse(text, Primitives).map(primitives);
    const value = input[0];
    const $ = reviver || noop;
    const tmp = typeof value === object && value ? revive(input, new Set(), value, $) : value;
    return $.call({ '': tmp }, '', tmp);
  } catch (e) {
    const { stack, file } = getStack();
    fs.writeFileSync(file, `${stack.join('\n')}\n\n${text}`);
    Logger.log('fail parse ' + file + ' ' + (e as Error).message);
    process.exit(1);
  }
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
 * @param any - The object to convert.
 * @returns The JSON representation of the object.
 */
const toJSON = (any: any): any => $parse(stringify(any));
export { toJSON };

/**
 * Parses a circular object from JSON.
 * @param any - The JSON string to parse.
 * @returns The parsed object.
 */
const fromJSON = (any: string): any => parse($stringify(any));
export { fromJSON, parse, stringify };
