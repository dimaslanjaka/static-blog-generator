"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWriteStream = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("upath"));
/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
function createWriteStream(dest, options) {
    if (!fs.existsSync(path.dirname(dest)))
        fs.mkdirSync(path.dirname(dest));
    return fs.createWriteStream(dest, options);
}
exports.createWriteStream = createWriteStream;
//# sourceMappingURL=stream.js.map