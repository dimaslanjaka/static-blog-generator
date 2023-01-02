"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isdev = void 0;
function isdev() {
    return /dev/i.test(process.env.NODE_ENV || '');
}
exports.isdev = isdev;
