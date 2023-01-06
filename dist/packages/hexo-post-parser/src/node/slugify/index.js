"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyWithCounter = void 0;
var escape_string_regexp_1 = __importDefault(require("../escape-string-regexp"));
var index_1 = __importDefault(require("../transliterate/index"));
var replacements_1 = __importDefault(require("./replacements"));
var decamelize = function (string) {
    return (string
        .replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
        .replace(/([a-z\d]+)([A-Z]{2,})/g, '$1 $2')
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2'));
};
var removeMootSeparators = function (string, separator) {
    var escapedSeparator = (0, escape_string_regexp_1.default)(separator);
    return string
        .replace(new RegExp("".concat(escapedSeparator, "{2,}"), 'g'), separator)
        .replace(new RegExp("^".concat(escapedSeparator, "|").concat(escapedSeparator, "$"), 'g'), '');
};
var defOpt = {
    separator: '-',
    lowercase: true,
    decamelize: true,
    customReplacements: [],
    preserveLeadingUnderscore: false,
    preserveTrailingDash: false
};
function slugify(string, options) {
    if (options === void 0) { options = {}; }
    if (typeof string !== 'string') {
        throw new TypeError("Expected a string, got `".concat(typeof string, "`"));
    }
    options = Object.assign(defOpt, options);
    var shouldPrependUnderscore = options.preserveLeadingUnderscore && string.startsWith('_');
    var shouldAppendDash = options.preserveTrailingDash && string.endsWith('-');
    var customReplacements = new Map(__spreadArray(__spreadArray([], __read(replacements_1.default), false), __read(options.customReplacements), false));
    string = (0, index_1.default)(string, { customReplacements: customReplacements });
    if (options.decamelize) {
        string = decamelize(string);
    }
    var patternSlug = /[^a-zA-Z\d]+/g;
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
        string = "_".concat(string);
    }
    if (shouldAppendDash) {
        string = "".concat(string, "-");
    }
    return string;
}
exports.default = slugify;
function slugifyWithCounter() {
    var occurrences = new Map();
    var countable = function (string, options) {
        string = slugify(string, options);
        if (!string) {
            return '';
        }
        var stringLower = string.toLowerCase();
        var numberless = occurrences.get(stringLower.replace(/(?:-\d+?)+?$/, '')) || 0;
        var counter = occurrences.get(stringLower);
        occurrences.set(stringLower, typeof counter === 'number' ? counter + 1 : 1);
        var newCounter = occurrences.get(stringLower) || 2;
        if (newCounter >= 2 || numberless > 2) {
            string = "".concat(string, "-").concat(newCounter);
        }
        return string;
    };
    countable.reset = function () {
        occurrences.clear();
    };
    return countable;
}
exports.slugifyWithCounter = slugifyWithCounter;
