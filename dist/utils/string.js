"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDoubleSlashes = void 0;
const utils_1 = require("../gulp/utils");
function removeDoubleSlashes(str) {
    if ((0, utils_1.isValidHttpUrl)(str))
        return str.replace(/([^:]\/)\/+/g, '$1');
    return str.replace(/\/+/g, '/');
}
exports.removeDoubleSlashes = removeDoubleSlashes;
//# sourceMappingURL=string.js.map