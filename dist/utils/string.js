"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacePath = exports.bufferToString = exports.streamToString = exports.capitalizer = exports.escapeRegex = void 0;
var tslib_1 = require("tslib");
function escapeRegex(string, method) {
    if (method === void 0) { method = '1'; }
    if (method === '1' || !method)
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (method === '2')
        return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
exports.escapeRegex = escapeRegex;
function capitalizer(str, moreSymbols) {
    if (moreSymbols === void 0) { moreSymbols = []; }
    var symbols = ['-', ' '];
    if (Array.isArray(moreSymbols)) {
        symbols = symbols.concat(moreSymbols).filter(function (x, i, a) {
            return a.indexOf(x) === i;
        });
    }
    symbols.forEach(function (symbol) {
        str = str
            .split(symbol)
            .map(function (str) { return str.charAt(0).toUpperCase() + str.slice(1); })
            .join(symbol);
    });
    return str;
}
exports.capitalizer = capitalizer;
function streamToString(stream) {
    var chunks = [];
    return new Promise(function (resolve, reject) {
        stream.on('data', function (chunk) { return chunks.push(Buffer.from(chunk)); });
        stream.on('error', function (err) { return reject(err); });
        stream.on('end', function () { return resolve(Buffer.concat(chunks).toString('utf8')); });
    });
}
exports.streamToString = streamToString;
function bufferToString(array) {
    if (typeof Uint8Array !== 'undefined' && typeof TextDecoder !== 'undefined') {
        var td = new TextDecoder();
        var ua = new Uint8Array(array);
        return td.decode(ua);
    }
    else {
        return array.toString();
    }
}
exports.bufferToString = bufferToString;
function replacePath(source, toReplace, replacement) {
    if (replacement === void 0) { replacement = ''; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var upath;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Promise.resolve().then(function () { return tslib_1.__importStar(require('upath')); })];
                case 1:
                    upath = _a.sent();
                    return [2, upath.toUnix(source).replace(upath.toUnix(toReplace), replacement)];
            }
        });
    });
}
exports.replacePath = replacePath;
