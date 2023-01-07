import ansiColors from 'ansi-colors';
import gulp from 'gulp';
import through2 from 'through2';
import { extname, join, toUnix } from 'upath';
import { getConfig } from '../gulp.config';
import Logger from '../utils/logger';

//
// import { buildPost, parsePost } from '../../packages/hexo-post-parser/dist';
import { buildPost, parsePost } from 'hexo-post-parser';
import { gulpLog } from '../gulp-utils/gulp.debug';
import debug from '../utils/debug';
//

/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
export function copySinglePost(identifier: string, callback?: (...args: any[]) => any) {
  identifier = identifier.replace(extname(identifier), '');
  const config = getConfig();
  const sourcePostDir = join(process.cwd(), config.post_dir);
  const generatedPostDir = join(process.cwd(), config.source_dir, '_posts');
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
  const config = getConfig();
  const { excludes } = config;
  const sourcePostDir = join(process.cwd(), config.post_dir);
  const generatedPostDir = join(process.cwd(), config.source_dir, '_posts');
  return gulp
    .src(['**/*.*', '*.*', '**/*'], {
      cwd: toUnix(sourcePostDir),
      ignore: excludes,
      dot: true,
      noext: true
    })
    .pipe(gulpLog())
    .pipe(processPost(config))
    .pipe(gulp.dest(generatedPostDir));
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

  const log = debug('post');

  return through2.obj(function (file, _enc, callback) {
    const self = this;
    const success = function (file: import('vinyl')) {
      if (self.push) self.push(file);
      callback();
    };
    const drop = function () {
      callback();
    };

    if (file.isNull()) {
      if (config.generator.verbose) Logger.log(file.path + ' is null');
      return drop();
    }
    if (file.isStream()) {
      if (config.generator.verbose) Logger.log(file.path + ' is stream');
      return drop();
    }

    if (config) {
      // process markdown files
      if (file.extname === '.md') {
        if (config.generator.verbose) {
          Logger.log(logname, ansiColors.greenBright(toUnix(file.path.replace(process.cwd(), ''))));
        }
        const contents = file.contents?.toString() || '';

        // drop empty body
        if (contents.trim().length === 0) {
          if (config.generator.verbose) {
            Logger.log('content empty', ansiColors.redBright(toUnix(file.path.replace(process.cwd(), ''))));
          }
          return drop();
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
          .then(function (parse) {
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
                        const l = log.extend('label-assign');
                        l(
                          groupLabel,
                          parse.metadata[groupLabel],
                          ansiColors.yellowBright('+'),
                          config[groupLabel].assign[oldLabel]
                        );
                        parse.metadata[groupLabel] = parse.metadata[groupLabel].concat(
                          config[groupLabel].assign[oldLabel]
                        );
                        l.extend('result')(groupLabel, parse.metadata[groupLabel]);
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

                if (config.generator.verbose) {
                  Logger.log(logname, groupLabel + '-' + ansiColors.greenBright('assign'), parse.metadata[groupLabel]);
                }
              }

              const build = buildPost(parse);
              if (typeof build === 'string') {
                file.contents = Buffer.from(build);
                if (config.generator.verbose) {
                  Logger.log(logname, 'success', toUnix(file.path).replace(toUnix(process.cwd()), ''));
                }
                success(file);
              } else {
                Logger.log(logname, 'cannot rebuild', toUnix(file.path).replace(toUnix(process.cwd()), ''));
              }
            } else if (config.generator.verbose) {
              Logger.log(logname, 'cannot parse', toUnix(file.path).replace(toUnix(process.cwd()), ''));
            }
          })
          .catch((e) => Logger.log(e));
      } else {
        success(file);
      }
    } else {
      Logger.log('options not configured');
      drop();
    }
  });
}

gulp.task('post:copy', copyAllPosts);
