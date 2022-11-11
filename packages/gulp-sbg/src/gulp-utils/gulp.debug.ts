import through2 from 'through2';

export function gulpDebug() {
  return through2.obj(function (file, _enc, cb) {
    console.log(file.path);
    if (typeof this.push === 'function') this.push(file);
    cb(null, file);
  });
}
