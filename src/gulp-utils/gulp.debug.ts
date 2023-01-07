import ansiColors from 'ansi-colors';
import { EOL } from 'os';
import through2 from 'through2';
import { join, toUnix } from 'upath';
import { writefile } from '../utils/fm';
import { data_to_hash_sync } from '../utils/hash';
import Logger from '../utils/logger';
import scheduler from '../utils/scheduler';

export default function gulpDebug(filename?: string) {
  const caller = data_to_hash_sync(
    'md5',
    new Error('get caller').stack?.split(/\r?\n/gim).filter((str) => /(dist|src)/i.test(str))[1] || ''
  ).slice(0, 5);
  const pid = process.pid;
  const logname = 'gulp-' + ansiColors.gray('debug');

  return through2.obj(function (file, _enc, cb) {
    // Logger.log(ansiColors.yellowBright('gulp-debug'), process.pid, toUnix(file.path.replace(process.cwd(), '')));

    // dump
    const dumpfile = join(process.cwd(), 'tmp/dump/gulp-debug', filename || `${caller}-${pid}.log`);
    writefile(dumpfile, `${toUnix(file.path.replace(process.cwd(), ''))}` + EOL, {
      append: true
    });

    scheduler.add(`${logname} dump ${ansiColors.cyan(caller)} pid ${ansiColors.yellow(String(pid))}`, () =>
      console.log(logname, dumpfile)
    );

    if (typeof this.push === 'function') this.push(file);
    cb(null, file);
  });
}

/**
 * log all files
 * @returns
 */
export function gulpLog() {
  return through2.obj(function (file, _enc, cb) {
    Logger.log(ansiColors.yellowBright('gulp-log'), toUnix(file.path.replace(process.cwd(), '')));
    if (typeof this.push === 'function') this.push(file);
    cb(null, file);
  });
}
