import gulp from 'gulp';
import { buildPost, parsePost } from 'hexo-post-parser';
import { getConfig } from 'static-blog-generator';
import through2 from 'through2';
import { extname, join } from 'upath';

gulp.task('watch-post', function (done) {
  const sourceDir = join(__dirname, 'src-posts');
  //const destDir = join(__dirname, 'source/_posts');
  const watcher = gulp.watch(['**/*'], { cwd: sourceDir });
  watcher.on('change', (path) => {
    _copySingle(path);
  });
  watcher.on('add', (path) => {
    _copySingle(path);
  });

  const close = () => {
    watcher.close();
    done();
  };
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
});

const _copySingle = (identifier: string, callback?: CallableFunction) => {
  const sourceDir = join(__dirname, 'src-posts');
  const destDir = join(__dirname, 'source/_posts');
  identifier = identifier.replace(extname(identifier), '');
  ///const fileList = [];
  gulp
    .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
      cwd: sourceDir
    })
    .pipe(
      through2.obj(async function (file, _enc, next) {
        ///fileList.push(file.path);
        if (file.isNull()) return next();
        if (file.extname === '.md') {
          const parse = await parsePost(file.path, {
            shortcodes: {
              youtube: true,
              css: true,
              include: true,
              link: true,
              now: true,
              script: true,
              text: true,
              codeblock: true
            },
            cache: false,
            config: <any>getConfig(),
            formatDate: true,
            fix: true,
            sourceFile: file.path
          });
          const build = buildPost(parse);
          file.contents = Buffer.from(build);
          return next(null, file);
        } else if (file.isDirectory()) {
          return next(null, file);
        }
        next(null, file);
      })
    )
    .pipe(gulp.dest(destDir))
    .on('end', function () {
      //console.log(fileList);
      if (typeof callback === 'function') callback();
    });
};
//_copySingle('cara-menentukan-skala-pada-peta');
