"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.url_to_hash = exports.folder_to_hash = exports.data_to_hash_sync = exports.data_to_hash = exports.file_to_hash = void 0;
var axios_1 = __importDefault(require("axios"));
var crypto_1 = __importDefault(require("crypto"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var glob_1 = __importDefault(require("glob"));
var upath_1 = __importDefault(require("upath"));
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    options = Object.assign({ encoding: 'hex', ignored: [], pattern: '' }, options || {});
                    if (folder.startsWith('file:'))
                        folder = folder.replace('file:', '');
                    // fix non exist
                    if (!fs_extra_1.default.existsSync(folder))
                        folder = upath_1.default.join(__dirname, folder);
                    // run only if exist
                    if (fs_extra_1.default.existsSync(folder)) {
                        (0, glob_1.default)(options.pattern || '**/*', {
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
                        }, function (err, matches) {
                            if (!err) {
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
                                resolve({
                                    filesWithHash: filesWithHash,
                                    hash: data_to_hash_sync(alogarithm, Object.values(filesWithHash).join(''), options.encoding)
                                });
                            }
                            else {
                                reject(err);
                            }
                        });
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
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
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
                        writer.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
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