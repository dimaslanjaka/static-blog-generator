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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// https://github.com/sindresorhus/slugify
var escape_string_regexp_1 = __importDefault(require("../escape-string-regexp"));
var index_1 = __importDefault(require("../transliterate/index"));
var replacements_1 = __importDefault(require("./replacements"));
var decamelize = function (string) {
    return (string
        // Separate capitalized words.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9zbHVnaWZ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBc0U7QUFDdEUsMENBQTBDO0FBQzFDLGlGQUF5RDtBQUN6RCxpRUFBbUQ7QUFDbkQsZ0VBQTREO0FBRTVELElBQU0sVUFBVSxHQUFHLFVBQUMsTUFBTTtJQUN4QixPQUFPLENBQ0wsTUFBTTtRQUNKLDhCQUE4QjtTQUM3QixPQUFPLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO1NBQ3JDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUM7U0FFMUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQztTQUNyQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQ2hELENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixJQUFNLG9CQUFvQixHQUFHLFVBQUMsTUFBTSxFQUFFLFNBQVM7SUFDN0MsSUFBTSxnQkFBZ0IsR0FBRyxJQUFBLDhCQUFrQixFQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXZELE9BQU8sTUFBTTtTQUNWLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxVQUFHLGdCQUFnQixTQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDO1NBQzlELE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxXQUFJLGdCQUFnQixjQUFJLGdCQUFnQixNQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0UsQ0FBQyxDQUFDO0FBRUYsSUFBTSxNQUFNLEdBQUc7SUFDYixTQUFTLEVBQUUsR0FBRztJQUNkLFNBQVMsRUFBRSxJQUFJO0lBQ2YsVUFBVSxFQUFFLElBQUk7SUFDaEIsa0JBQWtCLEVBQUUsRUFBRTtJQUN0Qix5QkFBeUIsRUFBRSxLQUFLO0lBQ2hDLG9CQUFvQixFQUFFLEtB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