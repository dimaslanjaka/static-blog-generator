"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path_1 = tslib_1.__importDefault(require("path"));
var fm_1 = require("./fm");
var LockManager = (function () {
    function LockManager(name) {
        this.folder = path_1.default.join(process.cwd(), 'tmp/static-blog-generator/lock-' + process.env.CACHE_NAME || 'default');
        this.file = path_1.default.join(this.folder, name, 'index.lock');
    }
    LockManager.prototype.lock = function () {
        return (0, fm_1.writefile)(this.file, '');
    };
    LockManager.prototype.release = function () {
        (0, fs_1.rmSync)(this.file);
    };
    LockManager.prototype.exist = function () {
        return (0, fs_1.existsSync)(this.file);
    };
    return LockManager;
}());
exports.default = LockManager;
