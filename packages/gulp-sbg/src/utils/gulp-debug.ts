import through2 from 'through2';

/**
 * debug list of files from gulp.src
 * @returns
 */
export default function gulpDebug() {
  return through2.obj((file, _, next) => {
    console.log(file.path);
    next(null);
  });
}
