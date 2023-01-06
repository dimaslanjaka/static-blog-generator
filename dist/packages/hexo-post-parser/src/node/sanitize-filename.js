'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifySanitizeFilename = void 0;
var truncate_utf8_bytes_1 = __importDefault(require("./truncate-utf8-bytes"));
var illegalRe = /[\/\?<>\\:\*\|"]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;
function sanitize(input, replacement) {
    if (typeof input !== 'string') {
        throw new Error('Input must be string');
    }
    var sanitized = input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement);
    return (0, truncate_utf8_bytes_1.default)(sanitized, 255);
}
function sanitizeFilename(input, replacement) {
    if (replacement === void 0) { replacement = ''; }
    var output = sanitize(input, replacement);
    if (replacement === '') {
        return output;
    }
    return sanitize(output, '');
}
exports.default = sanitizeFilename;
function slugifySanitizeFilename(str) {
    return str
        .split(/[\s+]/)
        .filter(function (str) { return str.trim().length > 0; })
        .join('-');
}
exports.slugifySanitizeFilename = slugifySanitizeFilename;
