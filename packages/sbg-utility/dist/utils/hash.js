"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.url_to_hash = exports.folder_to_hash = exports.data_to_hash_sync = exports.data_to_hash = exports.file_to_hash = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var glob_1 = tslib_1.__importDefault(require("glob"));
var upath_1 = tslib_1.__importDefault(require("upath"));
/**
 * convert file to hash
 * @param alogarithm
 * @param path
 * @param encoding
 * @returns
 */
function file_to_hash(alogarithm, path, encoding) {
    if (encoding === void 0) { encoding = 'hex'; }
    return new Promise(function (resolve, reject) {
        var hash = crypto_1.default.createHash(alogarithm);
        var rs = fs_extra_1.default.createReadStream(path);
        rs.on('error', reject);
        rs.on('data', function (chunk) { return hash.update(chunk); });
        rs.on('end', function () { return resolve(hash.digest(encoding)); });
    });
}
exports.file_to_hash = file_to_hash;
/**
 * convert data to hash (async)
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
function data_to_hash(alogarithm, data, encoding) {
    if (alogarithm === void 0) { alogarithm = 'sha1'; }
    if (encoding === void 0) { encoding = 'hex'; }
    return new Promise(function (resolve, reject) {
        try {
            resolve(data_to_hash_sync(alogarithm, data, encoding));
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.data_to_hash = data_to_hash;
/**
 * convert data to hash (sync)
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
function data_to_hash_sync(alogarithm, data, encoding) {
    if (alogarithm === void 0) { alogarithm = 'sha1'; }
    if (encoding === void 0) { encoding = 'hex'; }
    return crypto_1.default.createHash(alogarithm).update(data).digest(encoding);
}
exports.data_to_hash_sync = data_to_hash_sync;
/**
 * get hashes from folder
 * @param alogarithm
 * @param folder
 * @param options
 * @returns
 */
function folder_to_hash(alogarithm, folder, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolvePromise, rejectPromise) {
                    options = Object.assign({ encoding: 'hex', ignored: [], pattern: '' }, options || {});
                    if (folder.startsWith('file:'))
                        folder = folder.replace('file:', '');
                    // fix non exist
                    if (!fs_extra_1.default.existsSync(folder))
                        folder = upath_1.default.join(__dirname, folder);
                    // run only if exist
                    if (fs_extra_1.default.existsSync(folder)) {
                        glob_1.default
                            .glob(options.pattern || '**/*', {
                            cwd: folder,
                            ignore: (options.ignored || [
                                '**/tmp/**',
                                '**/build/**',
                                '**/.cache/**',
                                '**/dist/**',
                                '**/.vscode/**',
                                '**/coverage/**',
                                '**/release/**',
                                '**/bin/**',
                                '**/*.json'
                            ]).concat('**/.git*/**', '**/node_modules/**'),
                            dot: true,
                            noext: true
                        })
                            .then(function (matches) {
                            var filesWithHash = {};
                            for (var i = 0; i < matches.length; i++) {
                                var item = matches[i];
                                var fullPath = upath_1.default.join(folder, item);
                                var statInfo = fs_extra_1.default.statSync(fullPath);
                                if (statInfo.isFile()) {
                                    var fileInfo = "".concat(fullPath, ":").concat(statInfo.size, ":").concat(statInfo.mtimeMs);
                                    var hash = data_to_hash_sync(alogarithm, fileInfo, options.encoding);
                                    filesWithHash[fullPath] = hash;
                                }
                            }
                            resolvePromise({
                                filesWithHash: filesWithHash,
                                hash: data_to_hash_sync(alogarithm, Object.values(filesWithHash).join(''), options.encoding)
                            });
                        })
                            .catch(rejectPromise);
                    }
                    else {
                        console.log(folder + ' not found');
                    }
                })];
        });
    });
}
exports.folder_to_hash = folder_to_hash;
/**
 * convert data to hash
 * @param alogarithm
 * @param url
 * @param encoding
 * @returns
 */
function url_to_hash(alogarithm, url, encoding) {
    if (alogarithm === void 0) { alogarithm = 'sha1'; }
    if (encoding === void 0) { encoding = 'hex'; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var outputLocationPath = upath_1.default.join(__dirname, 'node_modules/.cache/postinstall', upath_1.default.basename(url));
                    // remove slashes when url ends with slash
                    if (!upath_1.default.basename(url).endsWith('/')) {
                        outputLocationPath = outputLocationPath.replace(/\/$/, '');
                    }
                    // add extension when dot not exist
                    if (!upath_1.default.basename(url).includes('.')) {
                        outputLocationPath += '.tgz';
                    }
                    if (!fs_extra_1.default.existsSync(upath_1.default.dirname(outputLocationPath))) {
                        fs_extra_1.default.mkdirSync(upath_1.default.dirname(outputLocationPath), { recursive: true });
                    }
                    var writer = fs_extra_1.default.createWriteStream(outputLocationPath, { flags: 'w' });
                    (0, axios_1.default)(url, { responseType: 'stream' }).then(function (response) {
                        response.data.pipe(writer);
                        var error;
                        writer.on('error', function (err) {
                            error = err;
                            writer.close();
                            reject(err);
                        });
                        writer.on('close', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                if (!error) {
                                    // console.log('package downloaded', outputLocationPath.replace(__dirname, ''));
                                    file_to_hash(alogarithm, outputLocationPath, encoding).then(function (checksum) {
                                        resolve(checksum);
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    });
                })];
        });
    });
}
exports.url_to_hash = url_to_hash;
//# sourceMappingURL=hash.js.map