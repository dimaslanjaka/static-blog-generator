"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// https://github.com/sindresorhus/transliterate
const lodash_deburr_1 = __importDefault(require("lodash.deburr"));
const escape_string_regexp_1 = __importDefault(require("../escape-string-regexp"));
const replacements_1 = __importDefault(require("./replacements"));
const doCustomReplacements = (string, replacements) => {
    for (const [key, value] of replacements) {
        // TODO: Use `String#replaceAll()` when targeting Node.js 16.
        string = string.replace(new RegExp((0, escape_string_regexp_1.default)(key), 'g'), value);
    }
    return string;
};
function transliterate(string, options) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a string, got \`${typeof string}\``);
    }
    options = Object.assign({ customReplacements: [] }, options);
    const customReplacements = new Map([
        ...replacements_1.default,
        ...options.customReplacements
    ]);
    string = string.normalize();
    string = doCustomReplacements(string, customReplacements);
    string = (0, lodash_deburr_1.default)(string);
    return string;
}
exports.default = transliterate;
//# sourceMappingURL=index.js.map