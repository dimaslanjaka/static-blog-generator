"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.fs = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
exports.fs = fs;
const path = tslib_1.__importStar(require("upath"));
exports.path = path;
const wildcards = tslib_1.__importStar(require("./index-exports"));
tslib_1.__exportStar(require("./index-exports"), exports);
exports.default = wildcards;
//
//# sourceMappingURL=index.js.map