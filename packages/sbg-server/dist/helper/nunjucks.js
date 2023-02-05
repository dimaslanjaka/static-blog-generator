"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.parseDate = exports.getAuthorName = void 0;
var crypto_1 = __importDefault(require("crypto"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var nunjucks_1 = __importDefault(require("nunjucks"));
function getAuthorName(obj) {
    if (!obj)
        return 'unknown';
    if (typeof obj === 'string')
        return obj;
    if (obj.name)
        return obj.name;
    if (obj.nick)
        return obj.nick;
    if (obj.nickname)
        return obj.nickname;
    return 'unknown';
}
exports.getAuthorName = getAuthorName;
function parseDate(input, pattern) {
    if (pattern === void 0) { pattern = 'LLL'; }
    return (0, moment_timezone_1.default)(input).format(pattern);
}
exports.parseDate = parseDate;
var md5 = function (data) {
    return crypto_1.default.createHash('md5').update(data).digest('hex');
};
exports.md5 = md5;
function setupNunjuckHelper(env) {
    env.addGlobal('getAuthorName', getAuthorName);
    env.addGlobal('parseDate', parseDate);
    env.addGlobal('md5', exports.md5);
    /**
     * Returns a JSON stringified version of the value, safe for inclusion in an
     * inline <script> tag. The optional argument 'spaces' can be used for
     * pretty-printing.
     *
     * Output is NOT safe for inclusion in HTML! If that's what you need, use the
     * built-in 'dump' filter instead.
     * @see {@link https://stackoverflow.com/a/46427070/6404439}
     * @example
     * {{ objectData | json }}
     * {{ objectData | json(2) }}
     */
    env.addFilter('json', function (value, spaces) {
        if (value instanceof nunjucks_1.default.runtime.SafeString) {
            value = value.toString();
        }
        var jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c');
        return new nunjucks_1.default.runtime.SafeString(jsonString);
    });
}
exports.default = setupNunjuckHelper;
//# sourceMappingURL=nunjucks.js.map