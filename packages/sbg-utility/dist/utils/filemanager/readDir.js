"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirAsync = exports.readDir = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var upath_1 = __importDefault(require("upath"));
/**
 * read directory recursive callback
 * @param dir
 * @returns
 */
var readDir = function (dir, done) {
    var results = [];
    fs_extra_1.default.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file)
                return done(null, results);
            file = upath_1.default.resolve(dir, file);
            fs_extra_1.default.stat(file, function (err, stat) {
                if (!err && stat && stat.isDirectory()) {
                    (0, exports.readDir)(file, function (err, res) {
                        if (!err)
                            results = results.concat(res);
                        next();
                    });
                }
                else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};
exports.readDir = readDir;
/**
 * read directory recursive async
 * @param dir
 * @returns
 */
var readDirAsync = function (dir) {
    return new bluebird_1.default(function (resolve, reject) {
        (0, exports.readDir)(dir, function (err, files) {
            if (err)
                reject(err);
            resolve(files);
        });
    });
};
exports.readDirAsync = readDirAsync;
exports.default = exports.readDir;
//# sourceMappingURL=readDir.js.map