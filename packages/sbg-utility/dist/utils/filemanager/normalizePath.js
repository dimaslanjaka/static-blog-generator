"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinSolve = exports.normalizePath = void 0;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var true_case_path_1 = require("true-case-path");
var upath_1 = tslib_1.__importDefault(require("upath"));
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
    var join = upath_1.default.join.apply(upath_1.default, tslib_1.__spreadArray([], tslib_1.__read(str), false));
    if (fs_extra_1.default.existsSync(join)) {
        var casePath = (0, true_case_path_1.trueCasePathSync)(join);
        return upath_1.default.toUnix(casePath);
    }
    else {
        return join;
    }
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
    var merge = normalizePath.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(paths), false));
    if (!fs_extra_1.default.existsSync(upath_1.default.dirname(merge))) {
        fs_extra_1.default.mkdirSync(upath_1.default.dirname(merge), { recursive: true });
    }
    return merge;
}
exports.joinSolve = joinSolve;
exports.default = normalizePath;
//# sourceMappingURL=normalizePath.js.map