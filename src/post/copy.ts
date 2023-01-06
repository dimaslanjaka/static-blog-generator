import ansiColors from 'ansi-colors';
import gulp from 'gulp';
import through2 from 'through2';
import { extname, join, toUnix } from 'upath';
import { Application } from '..';
import gulpCached from '../gulp-utils/gulp.cache';
import gulpDebug from '../gulp-utils/gulp.debug';
import { commonIgnore, getConfig } from '../gulp.config';
import * as fm from '../utils/fm';
import LockManager from '../utils/lockmanager';
import Logger from '../utils/logger';

//
import { buildPost, parsePost } from '../../packages/hexo-post-parser/dist';
// import { buildPost, parsePost } from 'hexo-post-parser';
//

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
export function copyAllPosts(callback?: ((...args: any[]) => any) | null | undefined) {
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
  const api = new Application(process.cwd());
  const config = api.getConfig();
  const excludes: string[] = Array.isArray(config.exclude) ? config.exclude : [];
  excludes.push(...commonIgnore);
  Logger.log(logname, 'cwd', toUnix(process.cwd()));
  Logger.log(logname, 'copying source posts from', sourcePostDir);
  if (config.generator.verbose) Logger.log(logname, { excludes });

  const streamer = gulp.src(['**/*.*', '*.*', '**/*'], {
    cwd: toUnix(sourcePostDir),
    ignore: excludes,
    dot: true,
    noext: true
  });
  streamer.once('end', () => {
    // delete lock file
    lm.release();
  });

  // apply cache
  if (config.generator?.cache) streamer.pipe(gulpCached({ name: 'post-copy' }));
  // apply verbose
  const verbose = config.generator?.verbose;
  if (verbose) streamer.pipe(gulpDebug('post-copy'));

  // transform start
  streamer.pipe(processPost(config)).pipe(gulp.dest(generatedPostDir));

  return streamer.once('end', () => {
    typeof callback == 'function' && callback();
  });
}

/**
 * pipeable function to process post
 * @param config
 * @returns
 */
export function processPost(config: ReturnType<typeof getConfig>) {
  const logname = 'post:' + ansiColors.blueBright('processing');
  if (config.generator.verbose) {
    Logger.log(logname, 'cache=' + (config.generator.cache ? ansiColors.green('true') : ansiColors.red('false')));
  }

  return through2.obj((file, _enc, callback) => {
    if (file.isNull()) {
      if (config.generator.verbose) Logger.log(file.path + ' is null');
      return callback();
    }
    if (file.isStream()) {
      if (config.generator.verbose) Logger.log(file.path + ' is stream');
      return callback();
    }

    if (config) {
      // process markdown files
      if (file.extname === '.md') {
        Logger.log(logname, ansiColors.greenBright(toUnix(file.path.replace(process.cwd(), ''))));
        const contents = file.contents?.toString() || '';

        // drop empty body
        if (contents.trim().length === 0) {
          if (config.generator.verbose) {
            Logger.log('content empty', ansiColors.redBright(toUnix(file.path.replace(process.cwd(), ''))));
          }
          return callback();
        }

        parsePost(file.path, {
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
        })
          .then((parse) => {
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
                        if (config.generator.verbose) {
                          Logger.log(
                            logname,
                            ansiColors.blueBright('-'),
                            parse.metadata[groupLabel],
                            ansiColors.yellowBright('+'),
                            config[groupLabel].assign[oldLabel]
                          );
                        }
                        parse.metadata[groupLabel] = parse.metadata[groupLabel].concat(
                          config[groupLabel].assign[oldLabel]
                        );
                      }
                    }
                  }
                  // label mapper
                  if (config[groupLabel]?.mapper) {
                    for (const oldLabel in config[groupLabel].mapper) {
                      const index = parse.metadata[groupLabel].findIndex((str: string) => str === oldLabel);

                      if (index !== -1) {
                        parse.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                        if (config.generator.verbose) {
                          Logger.log(
                            logname,
                            ansiColors.redBright(parse.metadata[groupLabel][index]),
                            '~>',
                            ansiColors.greenBright(config[groupLabel].mapper[oldLabel])
                          );
                        }
                      }
                    }
                  }
                  // label lowercase
                  if (config.tags?.lowercase) {
                    parse.metadata.tags = parse.metadata.tags?.map((str) => str.toLowerCase()) || [];
                  }
                } else if (config.generator.verbose) {
                  Logger.log(logname, groupLabel, 'not found');
                }

                if (i == array.length - 1) {
                  if (config.generator.verbose) {
                    Logger.log(
                      logname,
                      groupLabel + '-' + ansiColors.greenBright('assign'),
                      parse.metadata[groupLabel]
                    );
                  }
                }
              }

              const build = buildPost(parse);
              if (typeof build === 'string') {
                file.contents = Buffer.from(build);
                Logger.log(logname, 'success', toUnix(file.path).replace(toUnix(process.cwd()), ''));
                return callback(null, file);
              } else {
                Logger.log(logname, 'cannot rebuild', toUnix(file.path).replace(toUnix(process.cwd()), ''));
              }
            } else if (config.generator.verbose) {
              Logger.log(logname, 'cannot parse', toUnix(file.path).replace(toUnix(process.cwd()), ''));
            }
          })
          .catch((e) => Logger.log(e));
      } else {
        callback(null, file);
      }
    } else {
      Logger.log('options not configured');
      callback();
    }
  });
}

gulp.task('post:copy', copyAllPosts);
