'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crypto = require('crypto');
var fs = require('fs-extra');
var os = require('os');
var through2 = require('through2');
var path = require('upath');
var _config = require('../config/_config.js');
require('ansi-colors');
require('stream');
require('../utils/logger.js');
require('debug');
require('../utils/filemanager/case-path.js');
require('path');
require('bluebird');
require('minimatch');
var normalizePath = require('../utils/filemanager/normalizePath.js');
var writefile = require('../utils/filemanager/writefile.js');
require('fs');
require('micromatch');
var hash = require('../utils/hash.js');
require('../utils/JSON-serializer.js');
require('../utils/JSON.js');
require('../utils/lockmanager.js');
require('hexo-util');
require('nunjucks');
var persistentCache = require('../utils/persistent-cache.js');
require('../utils/promisify.js');
require('../utils/scheduler.js');

/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
function getShaFile(file) {
    if (fs.statSync(file).isDirectory())
        return null;
    const testFile = fs.readFileSync(file);
    const sha1sum = crypto.createHash('sha1').update(testFile).digest('hex');
    return sha1sum;
}
function cacheLib(options) {
    const config = _config.getConfig();
    options = Object.assign({ name: 'gulp-cached', base: path.join(config.cwd, 'tmp'), prefix: '' }, options);
    return new persistentCache.persistentCache(options);
}
/**
 * * [source idea](https://github.com/gulp-community/gulp-cached/blob/8e8d13cb07b17113ff94700e87f136eeaa1f1340/index.js#L35-L44)
 * @param options
 * @returns
 */
function gulpCached(options = {}) {
    const caches = cacheLib(options);
    //const logname = 'gulp-' + ansiColors.grey('cached');
    const pid = process.pid;
    let caller;
    if (options.name) {
        caller = options.name;
    }
    else {
        caller =
            hash.data_to_hash_sync('md5', new Error('get caller').stack?.split(/\r?\n/gim).filter((str) => /(dist|src)/i.test(str))[1] || '').slice(0, 5) +
                '-' +
                pid;
    }
    return through2.obj(function (file, _enc, next) {
        // skip directory
        if (file.isDirectory())
            return next(null, file);
        const cacheKey = hash.md5(file.path);
        const sha1sum = getShaFile(file.path);
        /**
         * Checks if file has been changed by comparing its current SHA1
         * hash with the one in cache, if present. Returns true if the
         * file hasChanged, false if not.
         */
        const isChanged = () => {
            const currentHash = caches.getSync(cacheKey, '');
            const newHash = getShaFile(file.path);
            // If no hash exists for file, consider file has changed
            // cache has expired or cache file has been deleted
            if (!currentHash) {
                return true;
            }
            // Cache exists and hashes differ
            if (currentHash && currentHash !== newHash) {
                return true;
            }
            // check destination when cache exist
            if (options.dest && options.cwd) {
                const destPath = path.join(normalizePath.normalizePath(options.dest), normalizePath.removeCwd(file.path, options.cwd));
                return fs.existsSync(destPath);
            }
            // File has not changed, leave cache as-
            return false;
        };
        const paths = {
            dest: normalizePath.normalizePath(options.dest?.replace(process.cwd(), '') || ''),
            cwd: normalizePath.normalizePath(options.cwd?.replace(process.cwd(), '') || ''),
            source: normalizePath.normalizePath(file.path.replace(process.cwd(), ''))
        };
        // dump
        const dumpfile = path.join(process.cwd(), 'tmp/dump/gulp-cached', `${caller}.log`);
        writefile.writefile(dumpfile, `"${paths.source}" is cached ${isChanged()} with dest validation ${options.dest && options.cwd ? 'true' : 'false'}` + os.EOL, {
            append: true
        });
        /*scheduler.add(`${logname} dump ${ansiColors.cyan(caller)} pid ${ansiColors.yellow(String(pid))}`, () =>
          console.log(logname, dumpfile)
        );*/
        if (isChanged()) {
            // not cached
            caches.setSync(cacheKey, sha1sum);
            // push modified file
            if (typeof this.push === 'function')
                this.push(file);
            return next();
        }
        else {
            // cached
            // drop non-modified data
            return next();
        }
    });
}

exports.default = gulpCached;
exports.getShaFile = getShaFile;
exports.gulpCached = gulpCached;
