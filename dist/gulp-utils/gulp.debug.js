"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpDebug = void 0;
var through2_1 = __importDefault(require("through2"));
function gulpDebug() {
    return through2_1.default.obj(function (file, _enc, cb) {
        console.log(file.path);
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.gulpDebug = gulpDebug;
