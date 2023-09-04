"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
/**
 * delete folder/file async
 * @param path path of file/folder
 * @param throws enable throwable
 * @returns
 */
function del(path, throws) {
    return new bluebird_1.default((resolve, reject) => {
        const rmOpt = { recursive: true, force: true };
        if (fs_extra_1.default.existsSync(path)) {
            if (!throws) {
                // always success
                fs_extra_1.default.rm(path, rmOpt).then(resolve).catch(resolve);
            }
            else {
                fs_extra_1.default.rm(path, rmOpt).then(resolve).catch(reject);
            }
            /*if (statSync(path).isDirectory()) {
              rmdir(path, { maxRetries: 10 }).then(resolve).catch(resolve);
            } else {
              rm(path, rmOpt).then(resolve).catch(resolve);
            }*/
        }
        else {
            if (!throws) {
                // always success
                resolve(new Error(path + ' not found'));
            }
            else {
                reject(new Error(path + ' not found'));
            }
        }
    });
}
exports.del = del;
//# sourceMappingURL=del.js.map