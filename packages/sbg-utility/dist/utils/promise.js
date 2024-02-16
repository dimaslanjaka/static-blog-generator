"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
/**
 * async delayed
 * @param ms milliseconds
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.delay = delay;
//# sourceMappingURL=promise.js.map