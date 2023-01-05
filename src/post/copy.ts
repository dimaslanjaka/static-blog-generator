import ansiColors from 'ansi-colors';
import gulp from 'gulp';
import { buildPost, parsePost } from 'hexo-post-parser';
import through2 from 'through2';
import { extname, join, toUnix } from 'upath';
import gulpCached from '../gulp-utils/gulp.cache';
import gulpDebug from '../gulp-utils/gulp.debug';
import { commonIgnore, getConfig } from '../gulp.config';
import * as fm from '../utils/fm';
import LockManager from '../utils/lockmanager';
import Logger from '../utils/logger';
import scheduler from '../utils/scheduler';

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

  const streamer = gulp.src('**/*.*', { cwd: toUnix(sourcePostDir), ignore: excludes });
  streamer.once('end', () => {
    // delete lock file
    lm.release();
  });

  // apply cache
  if (config.generator?.cache) streamer.pipe(gulpCached({ name: 'post-copy' }));
  // apply verbose
  const verbose = config.generator?.verbose;
  const writeVerbose = (msg: string) => {
    const write = fm.writefile(join(process.cwd(), 'tmp/logs/post-copy', process.pid + '.log'), msg, {
      append: true
    });
    scheduler.add('verbose', () => console.log(write.file));
  };
  if (verbose) streamer.pipe(gulpDebug());
  // transform start
  streamer
    .pipe(
      through2.obj(async (file, _enc, callback) => {
        if (file.isNull()) {
          if (verbose) writeVerbose(file.path + ' is null');
          return callback();
        }
        if (file.isStream()) {
          if (verbose) writeVerbose(file.path + ' is stream');
          return callback();
        }
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
            config: <any>config,
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

            console.log(parse.metadata.permalink);

            if (verbose) {
              fm.writefile(join(process.cwd(), 'tmp/dump.json'), parse);
            }

            const build = buildPost(parse);
            if (typeof build === 'string') {
              file.contents = Buffer.from(build);
              return callback(null, file);
            } else {
              Logger.log(logname, 'cannot rebuild', toUnix(file.path).replace(toUnix(process.cwd()), ''));
              return callback();
            }
          } else {
            Logger.log(logname, 'cannot parse', toUnix(file.path).replace(toUnix(process.cwd()), ''));
          }
        }
        callback(null, file);
      })
    )
    .pipe(gulp.dest(generatedPostDir));

  return streamer;
}

gulp.task('post:copy', copyAllPosts);
gulp.task('copy-all-post', gulp.series('post:copy'));
gulp.task('copy-all-posts', gulp.series('post:copy'));
gulp.task('copy-posts', gulp.series('post:copy'));
gulp.task('copy-post', gulp.series('post:copy'));

//gulp.task('watch-post', watchPost);
//gulp.task('watch-posts', watchPost);
