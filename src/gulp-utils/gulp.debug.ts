import ansiColors from 'ansi-colors';
import through2 from 'through2';
import { toUnix } from 'upath';
import Logger from '../utils/logger';

export default function gulpDebug() {
  return through2.obj(function (file, _enc, cb) {
    Logger.log(ansiColors.yellowBright('gulp-debug'), toUnix(file.path.replace(process.cwd(), '')));
    if (typeof this.push === 'function') this.push(file);
    cb(null, file);
  });
}
