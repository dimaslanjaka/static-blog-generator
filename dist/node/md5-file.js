"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.md5FileSync = void 0;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const fs = tslib_1.__importStar(require("fs"));
/**
 * MD5 file synchronously
 * @param path
 * @returns
 */
function md5FileSync(path) {
    let fileBuffer = Buffer.from(path);
    if (fs.existsSync(path)) {
        fileBuffer = fs.readFileSync(path);
    }
    const hashSum = crypto_1.default.createHash('md5'); // sha256
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}
exports.md5FileSync = md5FileSync;
/**
 * PHP MD5 Equivalent
 * @param data
 * @returns
 */
function md5(data) {
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
exports.md5 = md5;
function md5File(path) {
    return new Promise((resolve, reject) => {
        const output = crypto_1.default.createHash('md5');
        const input = fs.createReadStream(path);
        input.on('error', (err) => {
            reject(err);
        });
        output.once('readable', () => {
            resolve(output.read().toString('hex'));
        });
        input.pipe(output);
    });
}
exports.default = md5File;
//# sourceMappingURL=md5-file.js.map