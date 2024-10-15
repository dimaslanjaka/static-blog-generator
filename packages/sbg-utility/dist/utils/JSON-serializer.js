'use strict';

var crypto = require('crypto');
var fs = require('fs');
var url = require('node:url');
var path = require('path');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var crypto__namespace = /*#__PURE__*/_interopNamespaceDefault(crypto);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

/* eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }] */
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('utils/JSON-serializer.js', document.baseURI).href)));
const { parse: $parse, stringify: $stringify } = JSON;
const { keys } = Object;
/**
 * Generates an SHA-1 hash from the provided data.
 * @param data - The input data to hash.
 * @returns The SHA-1 hash of the data.
 */
function sha1(data) {
    return crypto__namespace.createHash('sha1').update(data.toString(), 'binary').digest('hex');
}
/**
 * Retrieves the current stack trace and creates an error log file.
 * @returns An object containing the stack trace and the file path.
 */
function getStack() {
    const stack = new Error('get caller').stack
        ?.split(/\r?\n/gim)
        .filter((str) => /(dist|src)/i.test(str) && !str.includes(__filename$1)) ?? [];
    const folder = path__namespace.join(process.cwd(), 'tmp/error/json-serializer');
    // Create folder if it does not exist
    if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
    const file = path__namespace.join(folder, `${sha1(stack[1])}.log`);
    return { stack, file };
}
const Primitive = String; // It could be Number
const primitive = 'string'; // It could be 'number'
const ignore = {};
const object = 'object';
const noop = (_, value) => value;
const primitives = (value) => (value instanceof Primitive ? Primitive(value) : value);
const Primitives = (_, value) => (typeof value === primitive ? new Primitive(value) : value);
/**
 * Recursively revives circular references in a parsed object.
 */
const revive = (input, parsed, output, $) => {
    const lazy = [];
    for (let ke = keys(output), { length } = ke, y = 0; y < length; y++) {
        const k = ke[y];
        const value = output[k];
        if (value instanceof Primitive) {
            const tmp = input[value];
            if (typeof tmp === object && !parsed.has(tmp)) {
                parsed.add(tmp);
                output[k] = ignore;
                lazy.push({ k, a: [input, parsed, tmp, $] });
            }
            else
                output[k] = $.call(output, k, tmp);
        }
        else if (output[k] !== ignore)
            output[k] = $.call(output, k, value);
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
const set = (known, input, value) => {
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
const parse = (text, reviver) => {
    try {
        const input = $parse(text, Primitives).map(primitives);
        const value = input[0];
        const $ = reviver || noop;
        const tmp = typeof value === object && value ? revive(input, new Set(), value, $) : value;
        return $.call({ '': tmp }, '', tmp);
    }
    catch (e) {
        const { stack, file } = getStack();
        fs__namespace.writeFileSync(file, `${stack.join('\n')}\n\n${text}`);
        console.log('fail parse ' + file + ' ' + e.message);
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
const stringify = (value, replacer, space) => {
    const $ = replacer && typeof replacer === 'object'
        ? (k, v) => (k === '' || replacer.indexOf(k) !== -1 ? v : void 0)
        : replacer || noop;
    const known = new Map();
    const input = [];
    const output = [];
    let i = +set(known, input, $.call({ '': value }, '', value));
    let firstRun = !i;
    while (i < input.length) {
        firstRun = true;
        output[i] = $stringify(input[i++], replace, space);
    }
    return '[' + output.join(',') + ']';
    function replace(key, value) {
        if (firstRun) {
            firstRun = false;
            return value;
        }
        const after = $.call(this, key, value);
        switch (typeof after) {
            case object:
                if (after === null)
                    return after;
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
const toJSON = (any) => $parse(stringify(any));
/**
 * Parses a circular object from JSON.
 * @param any - The JSON string to parse.
 * @returns The parsed object.
 */
const fromJSON = (any) => parse($stringify(any));

exports.fromJSON = fromJSON;
exports.parse = parse;
exports.stringify = stringify;
exports.toJSON = toJSON;
