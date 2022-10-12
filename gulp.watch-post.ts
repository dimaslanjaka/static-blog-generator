import frontMatter from 'front-matter';
import { writeFileSync } from 'fs';
import gulp from 'gulp';
import { buildPost, parsePost, postMap } from 'hexo-post-parser';
import moment from 'moment-timezone';
import { getConfig, scheduler } from 'static-blog-generator';
import through2 from 'through2';
import { TaskCallback } from 'undertaker';
import { extname, join, toUnix } from 'upath';

function watchPost(done: TaskCallback) {
  const sourceDir = join(__dirname, 'src-posts');
  //const destDir = join(__dirname, 'source/_posts');
  const watcher = gulp.watch(['**/*'], { cwd: sourceDir });
  watcher.on('change', (path) => {
    _copySingle(path);
  });
  watcher.on('add', (path) => {
    _copySingle(path);
  });
  watcher.once('close', done);
}

gulp.task('watch-post', watchPost);
gulp.task('watch-posts', watchPost);

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
          const config = <any>getConfig();
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
            config,
            formatDate: true,
            fix: true,
            sourceFile: file.path
          });
          if (parse) {
            // update post modified
            const oriUp = parse.metadata.updated;
            const oriPath = file.path;
            parse.metadata.updated = moment()
              .tz(config.timezone || 'UTC')
              .format();
            /*parse.metadata.date = moment(String(parse.metadata.date))
              .tz(config.timezone || 'UTC')
              .format();*/
            const post = frontMatter<Record<string, any>>(
              String(file.contents)
            );
            if ('updated' in post.attributes === false) {
              post.attributes.updated = parse.metadata.updated;
            }
            post.attributes.updated = parse.metadata.updated;
            post.attributes.date = parse.metadata.date;
            const rBuild: postMap = {
              metadata: <any>post.attributes,
              body: post.body,
              content: post.body,
              config
            };

            // update original source post after process ends
            scheduler.add(oriPath, function () {
              const rebuild = buildPost(rBuild);
              //writeFileSync(join(__dirname, 'tmp/rebuild.md'), rebuild);
              console.log(
                'write to',
                toUnix(oriPath).replace(toUnix(process.cwd()), ''),
                oriUp,
                '->',
                post.attributes.updated
              );
              writeFileSync(oriPath, rebuild); // write original post
            });

            const build = buildPost(parse);
            file.contents = Buffer.from(build);
            return next(null, file);
          } else {
            console.log('cannot parse', file.path);
            return next(null);
          }
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
