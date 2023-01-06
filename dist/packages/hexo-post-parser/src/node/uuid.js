"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeid = void 0;
var md5_file_1 = require("./md5-file");
function uuidv4(fromString) {
    var original = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    if (typeof fromString === 'string') {
        var hash = (0, md5_file_1.md5)(fromString);
        original = original
            .replace(/^xxxxxxxx-xxxx/, hash.slice(0, 8) + '-' + hash.slice(9, 13))
            .replace(/xxx-xxxxxxxxxxxx$/, hash.slice(14, 17) + '-' + hash.slice(18, 30));
    }
    else {
        var err = new Error();
        var caller_line = err.stack.split('\n')[2];
        var index = caller_line.indexOf('at ');
        var dumpClean = caller_line.slice(index + 2, caller_line.length);
        return uuidv4((0, md5_file_1.md5)(dumpClean));
    }
    return original.replace(/[xy]/g, function (c) {
        if (typeof fromString !== 'string') {
            var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
        else {
            var r = 0;
            var v = r | 0x8;
            if (c == 'y')
                v = (r & 0x3) | 0x8;
            return v.toString(16);
        }
    });
}
exports.default = uuidv4;
var makeid = function (n, prefix) {
    if (n === void 0) { n = 36; }
    if (prefix === void 0) { prefix = ''; }
    if (n > 1)
        return prefix + Math.random().toString(n).slice(2);
    var text = '';
    var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < n; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
};
exports.makeid = makeid;
