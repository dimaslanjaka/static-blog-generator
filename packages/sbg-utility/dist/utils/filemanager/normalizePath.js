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
exports.joinSolve = exports.normalizePath = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var true_case_path_1 = require("true-case-path");
var upath_1 = __importDefault(require("upath"));
/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
function normalizePath() {
    var str = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        str[_i] = arguments[_i];
    }
    var join = upath_1.default.join.apply(upath_1.default, __spreadArray([], __read(str), false));
    var casePath = (0, true_case_path_1.trueCasePathSync)(join);
    return upath_1.default.toUnix(casePath);
}
exports.normalizePath = normalizePath;
/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */
function joinSolve() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var merge = normalizePath.apply(void 0, __spreadArray([], __read(paths), false));
    if (!fs_extra_1.default.existsSync(upath_1.default.dirname(merge)))
        fs_extra_1.default.mkdirSync(upath_1.default.dirname(merge), { recursive: true });
    return merge;
}
exports.joinSolve = joinSolve;
exports.default = normalizePath;
//# sourceMappingURL=normalizePath.js.map