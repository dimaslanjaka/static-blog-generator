"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisify = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
/**
 * make any function to be promise
 * @param func
 * @param options
 * @returns
 */
function promisify(func, options) {
    return bluebird_1.default.promisify(func, options);
}
exports.promisify = promisify;
//# sourceMappingURL=promisify.js.map