import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import path from 'path';
import through2 from 'through2';
import { toUnix } from 'upath';
import scheduler from '../utils/scheduler';

export default function gulpDebug() {
  return through2.obj(function (file, _enc, cb) {
    // Logger.log(ansiColors.yellowBright('gulp-debug'), process.pid, toUnix(file.path.replace(process.cwd(), '')));

    // dump
    const dumpfile = path.join(process.cwd(), 'tmp/dump/gulp-cache.txt');
    fs.appendFileSync(dumpfile, `${toUnix(file.path.replace(process.cwd(), ''))}`);

    scheduler.add('dump gulp-debug', () => console.log(ansiColors.yellowBright('gulp-debug'), dumpfile));

    if (typeof this.push === 'function') this.push(file);
    cb(null, file);
  });
}
