"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var filemanager_1 = require("./filemanager");
var scheduler_1 = __importDefault(require("./scheduler"));
var locks = [];
var LockManager = /** @class */ (function () {
    function LockManager(name) {
        this.folder = path_1.default.join(process.cwd(), 'tmp/cache/lock');
        this.file = path_1.default.join(this.folder, name, os_1.default.platform() + '-index.lock');
        locks.push(this);
    }
    LockManager.prototype.lock = function () {
        return (0, filemanager_1.writefile)(this.file, '');
    };
    LockManager.prototype.release = function () {
        console.log(path_1.default.dirname(this.file), 'released');
        if (!fs_extra_1.default.existsSync(this.file))
            return;
        return fs_extra_1.default.rmSync(this.file, { recursive: true });
    };
    LockManager.prototype.releaseAsync = function () {
        console.log(path_1.default.dirname(this.file), 'released');
        if (!fs_extra_1.default.existsSync(this.file))
            return Promise.resolve();
        return fs_extra_1.default.rm(this.file, { recursive: true });
    };
    LockManager.prototype.exist = function () {
        return fs_extra_1.default.existsSync(this.file);
    };
    return LockManager;
}());
exports.default = LockManager;
scheduler_1.default.add('clean locks', function () {
    locks.forEach(function (lock) { return lock.release(); });
});
//# sourceMappingURL=lockmanager.js.map