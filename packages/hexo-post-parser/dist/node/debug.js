"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
/**
 * debug log
 * @param name
 * @returns
 */
function debug(name) {
    return (0, debug_1.default)('hexo-post-parser').extend(name);
}
exports.default = debug;
//# sourceMappingURL=debug.js.map