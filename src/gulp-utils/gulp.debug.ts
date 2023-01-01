import through2 from 'through2';
import Logger from '../utils/logger';

export function gulpDebug() {
  return through2.obj(function (file, _enc, cb) {
    Logger.log(file.path);
    if (typeof this.push === 'function') this.push(file);
    cb(null, file);
  });
}
