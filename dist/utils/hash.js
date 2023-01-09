"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data_to_hash_sync = exports.data_to_hash = exports.file_to_hash = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_extra_1 = __importDefault(require("fs-extra"));
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
function data_to_hash_sync(alogarithm, data, encoding) {
    if (alogarithm === void 0) { alogarithm = 'sha1'; }
    if (encoding === void 0) { encoding = 'hex'; }
    return crypto_1.default.createHash(alogarithm).update(data).digest(encoding);
}
exports.data_to_hash_sync = data_to_hash_sync;
