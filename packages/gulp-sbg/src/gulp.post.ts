import frontMatter from 'front-matter';
import { writeFileSync } from 'fs';
import gulp from 'gulp';
import { buildPost, parsePost, postMap } from 'hexo-post-parser';
import moment from 'moment-timezone';
import PersistentCache from 'persistent-cache';
import through2 from 'through2';
import { TaskCallback } from 'undertaker';
import { extname, join, toUnix } from 'upath';
import ProjectConfig from './gulp.config';
import scheduler from './utils/scheduler';

const sourceDir = join(process.cwd(), 'src-posts');
const destDir = join(process.cwd(), 'source/_posts');

/**
 * Watch post while you writing new or modify posts from src-posts folder
 * @param done
 */
export function watchPost(done: TaskCallback) {
  const watcher = gulp.watch(['**/*'], { cwd: sourceDir });
  watcher.on('change', (path) => {
    copySinglePost(path);
  });
  watcher.on('add', (path) => {
    copySinglePost(path);
  });
  watcher.once('close', done);
}

/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
export const copySinglePost = (identifier: string, callback?: CallableFunction) => {
  identifier = identifier.replace(extname(identifier), '');
  ///const fileList = [];
  gulp
    .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
      cwd: sourceDir
    })
    .pipe(updatePost())
    .pipe(gulp.dest(destDir))
    .on('end', function () {
      //console.log(fileList);
      if (typeof callback === 'function') callback();
    });
};

/**
 * copy watched post
 * @returns
 */
export function updatePost() {
  return through2.obj(async function (file, _enc, next) {
    ///fileList.push(file.path);
    if (file.isNull()) return next();
    // process markdown files
    if (file.extname === '.md') {
      const config = ProjectConfig;
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
        config: config as any,
        formatDate: true,
        fix: true,
        sourceFile: file.path
      });
      if (parse && parse.metadata) {
        // update post modified
        const oriUp = parse.metadata.updated;
        const oriPath = file.path;
        parse.metadata.updated = moment()
          .tz(config.timezone || 'UTC')
          .format();
        /*parse.metadata.date = moment(String(parse.metadata.date))
          .tz(config.timezone || 'UTC')
          .format();*/
        const post = frontMatter<Record<string, any>>(String(file.contents));
        if ('updated' in post.attributes === false) {
          post.attributes.updated = parse.metadata.updated;
        }
        post.attributes.updated = parse.metadata.updated;
        post.attributes.date = parse.metadata.date;
        if ('modified' in parse.metadata) {
          post.attributes.modified = parse.metadata.modified;
        }
        const rBuild: postMap = {
          metadata: <any>post.attributes,
          body: post.body,
          content: post.body,
          config: config as any
        };

        // update original source post after process ends
        scheduler.add(oriPath, function () {
          const rebuild = buildPost(rBuild);
          //writeFileSync(join(process.cwd(), 'tmp/rebuild.md'), rebuild);
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
    }
    // keep copy other files
    next(null, file);
  });
}

// copy all posts from src-posts to source/_posts
export function copyAllPosts() {
  const excludes = Array.isArray(ProjectConfig.exclude) ? ProjectConfig.exclude : [];
  excludes.push('**/.vscode/**', '**/desktop.ini', '**/node_modules/**', '**/.frontmatter/**', '**/.git*/**');
  console.log('cwd', toUnix(process.cwd()));
  console.log('copying source posts from', sourceDir.replace(toUnix(process.cwd()), ''));
  return (
    gulp
      .src(['**/*', '**/*.*', '*.*'], { cwd: sourceDir, ignore: excludes })
      //.pipe(gulpCached())
      .pipe(gulpDebug())
      .pipe(
        through2.obj(async (file, _enc, callback) => {
          if (file.isNull()) return callback();
          // process markdown files
          if (file.extname === '.md') {
            const config = ProjectConfig;
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
              config: config as any,
              formatDate: true,
              fix: true,
              sourceFile: file.path
            });
            if (parse && parse.metadata) {
              const build = buildPost(parse);
              file.contents = Buffer.from(build);
              return callback(null, file);
            } else {
              console.log('cannot parse', toUnix(file.path).replace(toUnix(process.cwd()), ''));
            }
          }
          callback(null, file);
        })
      )
      .pipe(gulp.dest(destDir))
  );
}

/**
 *
 * @param options
 * @returns
 */
export function gulpCached(options: Parameters<typeof PersistentCache>[0] = {}) {
  const caches = PersistentCache(options);
  return through2.obj(function (file, _enc, next) {
    console.log('cache', caches.getSync(file.path));

    return next(null, file);
  });
}

export function gulpDebug() {
  return through2.obj(function (file, _enc, cb) {
    console.log(file.path);
    cb(null, file);
  });
}

gulp.task('copy-all-post', copyAllPosts);
gulp.task('watch-post', watchPost);
gulp.task('watch-posts', watchPost);
