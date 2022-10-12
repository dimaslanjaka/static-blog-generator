import gulp from 'gulp';
import through2 from 'through2';
import { join } from 'upath';

const _copySingle = (identifier: string) => {
  const sourceDir = join(__dirname, 'src-posts');
  const destDir = join(__dirname, 'source/_posts');
  const fileList = [];
  gulp
    .src('**/*' + identifier + '*', { cwd: sourceDir })
    .pipe(
      through2.obj(function (file, enc, cb) {
        fileList.push(file.path);
        cb(null);
      })
    )
    .pipe(gulp.dest('./tmp/posts'))
    .on('end', function () {
      console.log(fileList);
    });
};
_copySingle('cara-menentukan-skala-pada-peta');
