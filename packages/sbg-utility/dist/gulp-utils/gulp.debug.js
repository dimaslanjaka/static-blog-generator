'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ansiColors = require('ansi-colors');
var os = require('os');
var through2 = require('through2');
var path = require('upath');
require('fs-extra');
require('path');
require('bluebird');
require('minimatch');
require('../utils/filemanager/case-path.js');
var writefile = require('../utils/filemanager/writefile.js');
var hash = require('../utils/hash.js');
var logger = require('../utils/logger.js');
var scheduler = require('../utils/scheduler.js');

function gulpDebug(filename) {
    const caller = hash.data_to_hash_sync('md5', new Error('get caller').stack?.split(/\r?\n/gim).filter((str) => /(dist|src)/i.test(str))[1] || '').slice(0, 5);
    const pid = process.pid;
    const logname = 'gulp-' + ansiColors.gray('debug');
    return through2.obj(function (file, _enc, cb) {
        // Logger.log(ansiColors.yellowBright('gulp-debug'), process.pid, toUnix(file.path.replace(process.cwd(), '')));
        // dump
        const dumpfile = path.join(process.cwd(), 'tmp/dump/gulp-debug', filename || `${caller}-${pid}.log`);
        writefile.writefile(dumpfile, `${path.toUnix(file.path.replace(process.cwd(), ''))}` + os.EOL, {
            append: true
        });
        scheduler.scheduler.add(`${logname} dump ${ansiColors.cyan(caller)} pid ${ansiColors.yellow(String(pid))}`, () => console.log(logname, dumpfile));
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
/**
 * log all files
 * @returns
 */
function gulpLog(logname = '') {
    return through2.obj(function (file, _enc, cb) {
        logger.Logger.log(ansiColors.yellowBright('gulp-log'), logname, path.toUnix(file.path.replace(process.cwd(), '')), String(file.contents).length);
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}

exports.default = gulpDebug;
exports.gulpDebug = gulpDebug;
exports.gulpLog = gulpLog;
