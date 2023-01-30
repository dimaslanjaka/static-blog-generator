"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyWithCounter = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// https://github.com/sindresorhus/slugify
const escape_string_regexp_1 = __importDefault(require("../escape-string-regexp"));
const index_1 = __importDefault(require("../transliterate/index"));
const replacements_1 = __importDefault(require("./replacements"));
const decamelize = (string) => {
    return (string
        // Separate capitalized words.
        .replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
        .replace(/([a-z\d]+)([A-Z]{2,})/g, '$1 $2')
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2'));
};
const removeMootSeparators = (string, separator) => {
    const escapedSeparator = (0, escape_string_regexp_1.default)(separator);
    return string
        .replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
        .replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
};
const defOpt = {
    separator: '-',
    lowercase: true,
    decamelize: true,
    customReplacements: [],
    preserveLeadingUnderscore: false,
    preserveTrailingDash: false
};
function slugify(string, options = {}) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a string, got \`${typeof string}\``);
    }
    options = Object.assign(defOpt, options);
    const shouldPrependUnderscore = options.preserveLeadingUnderscore && string.startsWith('_');
    const shouldAppendDash = options.preserveTrailingDash && string.endsWith('-');
    const customReplacements = new Map([
        ...replacements_1.default,
        ...options.customReplacements
    ]);
    string = (0, index_1.default)(string, { customReplacements });
    if (options.decamelize) {
        string = decamelize(string);
    }
    let patternSlug = /[^a-zA-Z\d]+/g;
    if (options.lowercase) {
        string = string.toLowerCase();
        patternSlug = /[^a-z\d]+/g;
    }
    string = string.replace(patternSlug, options.separator);
    string = string.replace(/\\/g, '');
    if (options.separator) {
        string = removeMootSeparators(string, options.separator);
    }
    if (shouldPrependUnderscore) {
        string = `_${string}`;
    }
    if (shouldAppendDash) {
        string = `${string}-`;
    }
    return string;
}
exports.default = slugify;
function slugifyWithCounter() {
    const occurrences = new Map();
    const countable = (string, options) => {
        string = slugify(string, options);
        if (!string) {
            return '';
        }
        const stringLower = string.toLowerCase();
        const numberless = occurrences.get(stringLower.replace(/(?:-\d+?)+?$/, '')) || 0;
        const counter = occurrences.get(stringLower);
        occurrences.set(stringLower, typeof counter === 'number' ? counter + 1 : 1);
        const newCounter = occurrences.get(stringLower) || 2;
        if (newCounter >= 2 || numberless > 2) {
            string = `${string}-${newCounter}`;
        }
        return string;
    };
    countable.reset = () => {
        occurrences.clear();
    };
    return countable;
}
exports.slugifyWithCounter = slugifyWithCounter;
//# sourceMappingURL=index.js.map