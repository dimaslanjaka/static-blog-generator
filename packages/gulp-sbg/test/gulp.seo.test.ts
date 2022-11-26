import fm from 'front-matter';
import gulp from 'gulp';
import { join } from 'path';
import through2 from 'through2';

const publicDIR = join(__dirname, 'public');
const postDIR = join(__dirname, 'source/_posts');
gulp
  .src('**/*.md', { cwd: postDIR })
  .pipe(
    through2.obj(function (file, _enc, next) {
      if (file.isNull()) return next();
      if (file.isBuffer()) {
        const md = file.contents.toString('utf-8');
        const parse = fm(md);

        file.extname = '.html';
      }
      next(null, file);
    })
  )
  .pipe(gulp.dest(publicDIR));
