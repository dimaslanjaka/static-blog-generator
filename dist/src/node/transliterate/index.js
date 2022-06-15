"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// https://github.com/sindresorhus/transliterate
var lodash_deburr_1 = __importDefault(require("lodash.deburr"));
var escape_string_regexp_1 = __importDefault(require("../escape-string-regexp"));
var replacements_1 = __importDefault(require("./replacements"));
var doCustomReplacements = function (string, replacements) {
    var e_1, _a;
    try {
        for (var replacements_2 = __values(replacements), replacements_2_1 = replacements_2.next(); !replacements_2_1.done; replacements_2_1 = replacements_2.next()) {
            var _b = __read(replacements_2_1.value, 2), key = _b[0], value = _b[1];
            // TODO: Use `String#replaceAll()` when targeting Node.js 16.
            string = string.replace(new RegExp((0, escape_string_regexp_1.default)(key), 'g'), value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (replacements_2_1 && !replacements_2_1.done && (_a = replacements_2.return)) _a.call(replacements_2);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return string;
};
function transliterate(string, options) {
    if (typeof string !== 'string') {
        throw new TypeError("Expected a string, got `".concat(typeof string, "`"));
    }
    options = __assign({ customReplacements: [] }, options);
    var customReplacements = new Map(__spreadArray(__spreadArray([], __read(replacements_1.default), false), __read(options.customReplacements), false));
    string = string.normalize();
    string = doCustomReplacements(string, customReplacements);
    string = (0, lodash_deburr_1.default)(string);
    return string;
}
exports.default = transliterate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS90cmFuc2xpdGVyYXRlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBc0U7QUFDdEUsZ0RBQWdEO0FBQ2hELGdFQUFtQztBQUNuQyxpRkFBeUQ7QUFDekQsZ0VBQWlEO0FBRWpELElBQU0sb0JBQW9CLEdBQUcsVUFBQyxNQUFNLEVBQUUsWUFBWTs7O1FBQ2hELEtBQTJCLElBQUEsaUJBQUEsU0FBQSxZQUFZLENBQUEsMENBQUEsb0VBQUU7WUFBOUIsSUFBQSxLQUFBLGlDQUFZLEVBQVgsR0FBRyxRQUFBLEVBQUUsS0FBSyxRQUFBO1lBQ3BCLDZEQUE2RDtZQUM3RCxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFBLDhCQUFrQixFQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzFFOzs7Ozs7Ozs7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixTQUF3QixhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU87SUFDbkQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDOUIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxrQ0FBNEIsT0FBTyxNQUFNLE1BQUksQ0FBQyxDQUFDO0tBQ3BFO0lBRUQsT0FBTyxjQUNMLGtCQUFrQixFQUFFLEVBQUUsSUFDbkIsT0FBTyxDQUNYLENBQUM7SUFFRixJQUFNLGtCQUFrQixHQUFHLElBQUksR0FBRyx3Q0FDN0Isc0JBQW1CLGtCQUNuQixPQUFPLENBQUMsa0JBQWtCLFVBQzdCLENBQUM7SUFFSCxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUMxRCxNQUFNLEdBQUcsSUFBQSx1QkFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXhCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFwQkQsZ0NBb0JDIn0=