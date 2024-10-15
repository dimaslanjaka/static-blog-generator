import crypto__default from 'crypto';
import fs__default from 'fs-extra';
import { EOL } from 'os';
import through2 from 'through2';
import path__default from 'upath';
import { getConfig } from '../config/_config.mjs';
import 'ansi-colors';
import 'stream';
import '../utils/logger.mjs';
import 'debug';
import '../utils/filemanager/case-path.mjs';
import 'path';
import 'bluebird';
import 'minimatch';
import { normalizePath, removeCwd } from '../utils/filemanager/normalizePath.mjs';
import { writefile } from '../utils/filemanager/writefile.mjs';
import 'fs';
import 'micromatch';
import { data_to_hash_sync, md5 } from '../utils/hash.mjs';
import '../utils/JSON-serializer.mjs';
import '../utils/JSON.mjs';
import '../utils/lockmanager.mjs';
import 'hexo-util';
import 'nunjucks';
import { persistentCache } from '../utils/persistent-cache.mjs';
import '../utils/promisify.mjs';
import '../utils/scheduler.mjs';

/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
function getShaFile(file) {
    if (fs__default.statSync(file).isDirectory())
        return null;
    const testFile = fs__default.readFileSync(file);
    const sha1sum = crypto__default.createHash('sha1').update(testFile).digest('hex');
    return sha1sum;
}
function cacheLib(options) {
    const config = getConfig();
    options = Object.assign({ name: 'gulp-cached', base: path__default.join(config.cwd, 'tmp'), prefix: '' }, options);
    return new persistentCache(options);
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
            data_to_hash_sync('md5', new Error('get caller').stack?.split(/\r?\n/gim).filter((str) => /(dist|src)/i.test(str))[1] || '').slice(0, 5) +
                '-' +
                pid;
    }
    return through2.obj(function (file, _enc, next) {
        // skip directory
        if (file.isDirectory())
            return next(null, file);
        const cacheKey = md5(file.path);
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
                const destPath = path__default.join(normalizePath(options.dest), removeCwd(file.path, options.cwd));
                return fs__default.existsSync(destPath);
            }
            // File has not changed, leave cache as-
            return false;
        };
        const paths = {
            dest: normalizePath(options.dest?.replace(process.cwd(), '') || ''),
            cwd: normalizePath(options.cwd?.replace(process.cwd(), '') || ''),
            source: normalizePath(file.path.replace(process.cwd(), ''))
        };
        // dump
        const dumpfile = path__default.join(process.cwd(), 'tmp/dump/gulp-cached', `${caller}.log`);
        writefile(dumpfile, `"${paths.source}" is cached ${isChanged()} with dest validation ${options.dest && options.cwd ? 'true' : 'false'}` + EOL, {
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

export { gulpCached as default, getShaFile, gulpCached };
