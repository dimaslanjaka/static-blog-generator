import ansiColors from 'ansi-colors';
import fs from 'fs';
import gulp from 'gulp';
import through2 from 'through2';
//
// import { buildPost, parsePost } from '../../packages/hexo-post-parser/dist';
import * as hexoPostParser from 'hexo-post-parser';
import { gulpCached } from '..';
import debug from '../utils/debug';
//

import { extname, join, toUnix } from 'upath';
import Logger from '../utils/logger';
import { getConfig } from '../_config';
import { parsePermalink } from './permalink';

const log = debug('post');
const logerr = log.extend('error');
const logLabel = log.extend('label');

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
export function copyAllPosts(_callback?: gulp.TaskFunctionCallback, config?: ReturnType<typeof getConfig>) {
  if (!config) config = getConfig();
  const excludes = config.exclude || [];
  const sourcePostDir = join(process.cwd(), config.post_dir);
  const generatedPostDir = join(process.cwd(), config.source_dir, '_posts');
  // console.log(excludes, sourcePostDir);
  return (
    gulp
      .src(['**/*.*', '*.*', '**/*'], {
        cwd: toUnix(sourcePostDir),
        ignore: excludes,
        dot: true,
        noext: true
      })
      //.pipe(gulpLog('before'))
      .pipe(gulpCached({ name: 'post-copy' }))
      .pipe(pipeProcessPost(config))
      .pipe(gulp.dest(generatedPostDir))
  );
}

/**
 * pipeable function to process post
 * @param config
 * @returns
 */
export function pipeProcessPost(config: ReturnType<typeof getConfig>) {
  const logname = 'post:' + ansiColors.blueBright('processing');
  if (config.generator.verbose) {
    Logger.log(logname, 'cache=' + (config.generator.cache ? ansiColors.green('true') : ansiColors.red('false')));
  }

  return through2.obj(
    async function (file, _enc, callback) {
      if (file.isDirectory()) {
        return callback();
      }
      if (file.isNull()) {
        logerr(file.path + ' is null');
        return callback();
      }
      if (file.isStream()) {
        logerr(file.path + ' is stream');
        return callback();
      }

      if (config) {
        // process markdown files
        if (file.extname === '.md') {
          const compile = await processSinglePost(file.path);
          if (typeof compile === 'string') {
            file.contents = Buffer.from(compile);
            this.push(file);
            callback();
          } else {
            callback();
          }
        } else {
          this.push(file);
          callback();
        }
      } else {
        Logger.log('options not configured');
        callback();
      }
    }
    /*function (cb) {
      this.emit('end', 2);
      cb();
    }*/
  );
}

export async function processSinglePost(file: string) {
  const contents = fs.readFileSync(file, 'utf-8');
  const config = getConfig();
  // debug file
  const dfile = ansiColors.yellowBright(toUnix(file.replace(process.cwd(), '')));
  log('processing', dfile);
  // drop empty body
  if (contents.trim().length === 0) {
    logerr('content empty', dfile);
    return;
  }

  try {
    const parse = await hexoPostParser
      .parsePost(fs.readFileSync(file, 'utf-8'), {
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
        //config: <any>getConfig(),
        formatDate: true,
        fix: true,
        sourceFile: file
      })
      .catch((e) => Logger.log(e));

    if (parse && parse.metadata) {
      // fix permalink
      log.extend('permalink').extend('pattern')(config.permalink);
      //parse.metadata.permalink = hexoPostParser.parsePermalink(parse);
      if (!parse.metadata.permalink) {
        parse.metadata.permalink = parsePermalink(file, {
          title: parse.metadata.title,
          date: String(parse.metadata.date || new Date()),
          permalink_pattern: getConfig().permalink
        });
      }
      if (parse.metadata.permalink?.startsWith('/')) {
        parse.metadata.permalink = parse.metadata.permalink.replace(/^\//, '');
      }

      log.extend('permalink')(parse.metadata.permalink);
      // fix uuid and id
      if (parse.metadata.uuid) {
        if (!parse.metadata.id) parse.metadata.id = parse.metadata.uuid;
        delete parse.metadata.uuid;
      }
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
                logLabel(
                  groupLabel,
                  parse.metadata[groupLabel],
                  ansiColors.yellowBright('+'),
                  config[groupLabel].assign[oldLabel]
                );
                parse.metadata[groupLabel] = parse.metadata[groupLabel].concat(config[groupLabel].assign[oldLabel]);
                logLabel.extend('result')(groupLabel, parse.metadata[groupLabel]);
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
            parse.metadata[groupLabel] =
              (parse.metadata[groupLabel] as string[])?.map((str) => str.toLowerCase()) || [];
            log.extend('label').extend('lowercase')(groupLabel, parse.metadata[groupLabel]);
          }
        } else if (config.generator.verbose) {
          Logger.log(groupLabel, 'not found');
        }

        // Logger.log(groupLabel + '-' + ansiColors.greenBright('assign'), parse.metadata[groupLabel]);
      }

      const build = hexoPostParser.buildPost(parse);
      if (typeof build === 'string') {
        return build;
      }
    } else {
      logerr(String(parse), file);
    }
  } catch (e) {
    Logger.log(e);
  }
}

gulp.task('post:copy', copyAllPosts);
