"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppRootDir = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var true_case_path_1 = require("true-case-path");
var upath_1 = __importDefault(require("upath"));
function getAppRootDir() {
    var currentDir = __dirname;
    while (!fs_extra_1.default.existsSync(upath_1.default.join(currentDir, 'package.json'))) {
        currentDir = upath_1.default.join(currentDir, '..');
    }
    return upath_1.default.toUnix((0, true_case_path_1.trueCasePathSync)(currentDir));
}
exports.getAppRootDir = getAppRootDir;
exports.default = getAppRootDir;
//# sourceMappingURL=getAppRootDir.js.map