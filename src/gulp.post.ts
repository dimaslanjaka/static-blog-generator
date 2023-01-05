import ansiColors from 'ansi-colors';
import frontMatter from 'front-matter';
import { readFileSync } from 'fs';
import gulp from 'gulp';
import { buildPost, parsePost, postMap } from 'hexo-post-parser';
import moment from 'moment-timezone';
import through2 from 'through2';
import { extname, join, toUnix } from 'upath';
import gulpCached from './gulp-utils/gulp.cache';
import gulpDebug from './gulp-utils/gulp.debug';
import { commonIgnore, getConfig } from './gulp.config';
import * as fm from './utils/fm';
import LockManager from './utils/lockmanager';
import Logger from './utils/logger';

const sourcePostDir = join(process.cwd(), getConfig().post_dir);
const generatedPostDir = join(process.cwd(), getConfig().source_dir, '_posts');

/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
export function copySinglePost(identifier: string, callback?: (...args: any[]) => any) {
  identifier = identifier.replace(extname(identifier), '');
  ///const fileList = [];
  gulp
    .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
      cwd: sourcePostDir
    })
    .pipe(gulp.dest(generatedPostDir))
    .on('end', function () {
      //Logger.log(fileList);
      if (typeof callback === 'function') callback();
    });
}

const processingUpdate = {};

/**
 * update metadata.updated post
 * @returns
 */
export async function updatePost(postPath: string, callback?: (result: boolean, postPath: string) => any) {
  // immediately return without callback
  if (processingUpdate[postPath]) return false;
  // add to index
  processingUpdate[postPath] = true;

  const config = getConfig();
  const parse = await parsePost(postPath, {
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
    sourceFile: postPath
  });

  if (parse && parse.metadata) {
    // update post modified
    const oriUp = parse.metadata.updated;
    const oriPath = postPath;
    parse.metadata.updated = moment()
      .tz(config.timezone || 'UTC')
      .format();
    /*parse.metadata.date = moment(String(parse.metadata.date))
      .tz(config.timezone || 'UTC')
      .format();*/
    const post = frontMatter<Record<string, any>>(readFileSync(postPath, 'utf-8'));
    if ('updated' in post.attributes === false) {
      post.attributes.updated = parse.metadata.updated;
    }
    post.attributes.updated = parse.metadata.updated;
    post.attributes.date = parse.metadata.date;
    if ('modified' in parse.metadata) {
      post.attributes.modified = parse.metadata.modified;
    }

    // remove meta subtitle when description is same
    if (
      post.attributes.description &&
      post.attributes.subtitle &&
      post.attributes.description == post.attributes.subtitle
    ) {
      delete post.attributes.subtitle;
    }

    // prepare rebuild post
    const rBuild: postMap = {
      metadata: <any>post.attributes,
      body: post.body,
      content: post.body,
      config: config as any
    };

    // update original source post after process ends
    const rebuild = buildPost(rBuild);
    //writefile(join(process.cwd(), 'tmp/rebuild.md'), rebuild);
    Logger.log('write to', toUnix(oriPath).replace(toUnix(process.cwd()), ''), oriUp, '->', post.attributes.updated);
    await fm.writefile(oriPath, rebuild, { async: true }); // write original post

    const build = buildPost(parse);
    await fm.writefile(postPath, build, { async: true });
  } else {
    Logger.log('cannot parse', postPath);
    fm.writefile(join(process.cwd(), 'tmp/errors', updatePost.name, 'cannot-parse.log'), postPath, { append: true });
  }

  const hasError = typeof (parse && parse.metadata) === 'undefined';
  if (typeof callback === 'function') callback(hasError, postPath);
  // remove from index
  delete processingUpdate[postPath];
  return hasError;
}

/**
 * copy all posts from src-posts to source/_posts
 * @returns
 */
export function copyAllPosts() {
  // lock runner
  const lm = new LockManager(copyAllPosts.name);
  const logname = 'post:' + ansiColors.grey('copy');
  // skip process when found
  if (lm.exist()) {
    Logger.log('another process still running');
    const writeStream = fm.createWriteStream(join(lm.folder, 'dummy.txt'), { flags: 'a' });
    writeStream.write(String(new Date()));
    writeStream.close();
    return writeStream;
  }
  // write new lock
  lm.lock();

  // function start
  const config = getConfig();
  const excludes: string[] = Array.isArray(config.exclude) ? config.exclude : [];
  excludes.push(...commonIgnore);
  Logger.log(logname, 'cwd', toUnix(process.cwd()));
  Logger.log(logname, 'copying source posts from', sourcePostDir);

  return gulp
    .src('**/*.*', { cwd: toUnix(sourcePostDir), ignore: excludes })
    .pipe(gulpCached({ name: 'post' }))
    .pipe(gulpDebug())
    .pipe(
      through2.obj(async (file, _enc, callback) => {
        if (file.isNull()) return callback();
        // process markdown files
        if (file.extname === '.md') {
          const contents = file.contents?.toString() || '';
          // drop empty body
          if (contents.trim().length === 0) return callback();
          const parse = await parsePost(contents, {
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
            // process tags and categories
            const array = ['tags', 'categories'];
            for (let i = 0; i < array.length; i++) {
              const groupLabel = array[i];
              if (parse.metadata[groupLabel]) {
                // label assign
                if (config[groupLabel]?.assign) {
                  for (const oldLabel in config[groupLabel].assign) {
                    const index = parse.metadata[groupLabel].findIndex((str: string) => str == oldLabel);

                    if (index !== -1) {
                      parse.metadata[groupLabel] = config[groupLabel].assign[oldLabel];
                    }
                  }
                }
                // label mapper
                if (config[groupLabel]?.mapper) {
                  for (const oldLabel in config[groupLabel].mapper) {
                    const index = parse.metadata[groupLabel].findIndex((str: string) => str == oldLabel);

                    if (index !== -1) {
                      parse.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                    }
                  }
                }
                // label lowercase
                if (config.tags?.lowercase) {
                  parse.metadata.tags = parse.metadata.tags?.map((str) => str.toLowerCase()) || [];
                }
              }
            }

            const build = buildPost(parse);
            file.contents = Buffer.from(build);
            return callback(null, file);
          } else {
            Logger.log(logname, 'cannot parse', toUnix(file.path).replace(toUnix(process.cwd()), ''));
          }
        }
        callback(null, file);
      })
    )
    .pipe(gulp.dest(generatedPostDir))
    .once('end', () => {
      // delete lock file
      lm.release();
    });
}

gulp.task('post:copy', copyAllPosts);
gulp.task('copy-all-post', gulp.series('post:copy'));
gulp.task('copy-all-posts', gulp.series('post:copy'));
gulp.task('copy-posts', gulp.series('post:copy'));
gulp.task('copy-post', gulp.series('post:copy'));

//gulp.task('watch-post', watchPost);
//gulp.task('watch-posts', watchPost);
