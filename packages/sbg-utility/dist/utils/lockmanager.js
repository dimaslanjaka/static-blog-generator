'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var os = require('os');
var path = require('path');
require('bluebird');
require('minimatch');
require('upath');
require('./filemanager/case-path.js');
var writefile = require('./filemanager/writefile.js');
var scheduler = require('./scheduler.js');

const locks = [];
class LockManager {
    folder = path.join(process.cwd(), 'tmp/cache/lock');
    file;
    constructor(name) {
        this.file = path.join(this.folder, name, os.platform() + '-index.lock');
        locks.push(this);
    }
    lock() {
        return writefile.writefile(this.file, '');
    }
    release() {
        console.log(path.dirname(this.file), 'released');
        if (!fs.existsSync(this.file))
            return;
        return fs.rmSync(this.file, { recursive: true });
    }
    releaseAsync() {
        console.log(path.dirname(this.file), 'released');
        if (!fs.existsSync(this.file))
            return Promise.resolve();
        return fs.rm(this.file, { recursive: true });
    }
    exist() {
        return fs.existsSync(this.file);
    }
}
scheduler.scheduler.add('clean locks', () => {
    locks.forEach((lock) => lock.release());
});

exports.default = LockManager;
