import ansiColors from 'ansi-colors';
import { EOL } from 'os';
import through2 from 'through2';
import path__default from 'upath';
import 'fs-extra';
import 'path';
import 'bluebird';
import 'minimatch';
import '../utils/filemanager/case-path.mjs';
import { writefile } from '../utils/filemanager/writefile.mjs';
import { data_to_hash_sync } from '../utils/hash.mjs';
import { Logger } from '../utils/logger.mjs';
import { scheduler } from '../utils/scheduler.mjs';

function gulpDebug(filename) {
    const caller = data_to_hash_sync('md5', new Error('get caller').stack?.split(/\r?\n/gim).filter((str) => /(dist|src)/i.test(str))[1] || '').slice(0, 5);
    const pid = process.pid;
    const logname = 'gulp-' + ansiColors.gray('debug');
    return through2.obj(function (file, _enc, cb) {
        // Logger.log(ansiColors.yellowBright('gulp-debug'), process.pid, toUnix(file.path.replace(process.cwd(), '')));
        // dump
        const dumpfile = path__default.join(process.cwd(), 'tmp/dump/gulp-debug', filename || `${caller}-${pid}.log`);
        writefile(dumpfile, `${path__default.toUnix(file.path.replace(process.cwd(), ''))}` + EOL, {
            append: true
        });
        scheduler.add(`${logname} dump ${ansiColors.cyan(caller)} pid ${ansiColors.yellow(String(pid))}`, () => console.log(logname, dumpfile));
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
        Logger.log(ansiColors.yellowBright('gulp-log'), logname, path__default.toUnix(file.path.replace(process.cwd(), '')), String(file.contents).length);
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}

export { gulpDebug as default, gulpDebug, gulpLog };
