import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import gulp from 'gulp';
import * as hexoPostParser from 'hexo-post-parser';
import moment from 'moment-timezone';
import { debug, escapeRegex, getConfig, Logger, normalizePath } from 'sbg-utility';
import path from 'upath';
import { gulpOpt } from '../gulp-options';
import { removeCwd } from '../utils/path';
import { getSourcePosts } from './copy-utils';
import { parsePermalink } from './permalink';

/**
 * log debug
 *
 * @example
 * cross-env-shell DEBUG=* "your commands"
 */
const log = debug('post');
const logErr = log.extend('error');
const logLabel = log.extend('label');

/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
export function copySinglePost(identifier: string, callback?: (...args: any[]) => any) {
  identifier = identifier.replace(path.extname(identifier), '');
  const config = getConfig();
  const sourcePostDir = path.join(config.cwd, config.post_dir);
  const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
  ///const fileList = [];
  gulp
    .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
      cwd: sourcePostDir
    } as gulpOpt)
    .pipe(gulp.dest(generatedPostDir))
    .on('end', function () {
      //Logger.log(fileList);
      if (typeof callback === 'function') callback();
    });
}

/**
 * Copy all posts from src-posts to source/_posts using elimination strategy
 *
 * @param config Optional configuration object
 * @returns Promise<void>
 */
export async function copyAllPosts(config?: ReturnType<typeof getConfig>): Promise<void> {
  if (!config) config = getConfig();
  const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
  const posts = getSourcePosts(config);

  /**
   * Process a markdown file
   *
   * @param file The file path to process
   * @returns Promise<void>
   */
  const processMarkdown = async function (file: string): Promise<void> {
    const content = await fs.readFile(file, 'utf8'); // Read file content
    const compile = await processSinglePost({ content, file }).catch(() => null); // Process content

    if (typeof compile === 'string') {
      const { post_dir = 'src-posts' } = config;
      const regex = new RegExp(`[\\/\\\\]${escapeRegex(post_dir)}[\\/\\\\]`);
      const fileWithoutCwd = removeCwd(file).replace(regex, '');
      const dest = path.join(generatedPostDir, fileWithoutCwd); // Generate destination path
      // Ensure the destination directory exists
      await fs.ensureDir(path.dirname(dest));
      // Write the compiled markdown directly to the destination file
      await fs.writeFile(dest, compile, 'utf8');
    }
  };

  /**
   * Copy non-markdown file
   *
   * @param file The file path to copy
   * @returns Promise<void>
   */
  const processAssets = async function (file: string): Promise<void> {
    const fileWithoutCwd = removeCwd(file).replace(/[/\\]src-posts[/\\]/, '');
    const dest = path.join(generatedPostDir, fileWithoutCwd); // Generate destination path
    await fs.ensureDir(path.dirname(dest)); // Ensure the destination directory exists

    // Copy the file to the destination
    await fs.copy(file, dest);
  };

  console.log('Processing', posts.length, 'post(s)');

  // Process posts one by one using posts.shift() elimination strategy
  while (posts.length > 0) {
    const post = posts.shift()!;
    // skip directory and undefined
    if (
      typeof post !== 'string' ||
      (
        await fs.stat(post).catch(() => {
          return {
            isDirectory: () => true
          };
        })
      ).isDirectory()
    )
      continue;
    if (post.endsWith('.md')) {
      await processMarkdown(post);
    } else {
      await processAssets(post);
    }

    // Trigger garbage collection if possible
    if (global.gc) {
      global.gc();
    }
  }
}

// /**
//  * copy all posts from src-posts to source/_posts
//  * @returns
//  */
// export function copyAllPosts(config?: ReturnType<typeof getConfig>) {
//   if (!config) config = getConfig();
//   const excludes = config.exclude || [];
//   const sourcePostDir = path.join(config.cwd, config.post_dir);
//   const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
//   const posts = globSync(['**/*.*', '*.*', '**/*'], {
//     cwd: sourcePostDir,
//     ignore: excludes,
//     dot: true,
//     noext: true,
//     absolute: true
//   }).map((s) => normalizePath(s));
//   return processFiles(
//     posts,
//     async function (filePath, content) {
//       const compile = await processSinglePost({ content, file: filePath }).catch(() => null);
//       if (typeof compile === 'string') {
//         const fileWithoutCwd = removeCwd(filePath).replace(/[/\\]src-posts[/\\]/, '');
//         const dest = path.join(generatedPostDir, fileWithoutCwd);
//         fs.ensureDirSync(path.dirname(dest));
//         fs.writeFileSync(dest, compile);
//       }
//     },
//     noop
//   );
// }

// /**
//  * copy all posts from src-posts to source/_posts
//  * @returns
//  */
// function _copyAllPosts(_callback?: gulp.TaskFunctionCallback, config?: ReturnType<typeof getConfig>) {
//   if (!config) config = getConfig();
//   const excludes = config.exclude || [];
//   const sourcePostDir = path.join(config.cwd, config.post_dir);
//   const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
//   // console.log(excludes, sourcePostDir);
//   return (
//     gulp
//       .src(['**/*.*', '*.*', '**/*'], {
//         cwd: sourcePostDir,
//         ignore: excludes,
//         dot: true,
//         noext: true
//       } as gulpOpt)
//       //.pipe(gulpLog('before'))
//       .pipe(gulpCached({ name: 'post-copy' }))
//       .pipe(pipeProcessPost(config))
//       .pipe(gulp.dest(generatedPostDir))
//   );
// }

// /**
//  * pipeable function to process post
//  * @param config
//  * @returns
//  */
// export function pipeProcessPost(config: ReturnType<typeof getConfig>) {
//   const logname = 'post:' + ansiColors.blueBright('processing');
//   if (config.generator.verbose) {
//     Logger.log(logname, 'cache=' + (config.generator.cache ? ansiColors.green('true') : ansiColors.red('false')));
//   }

//   return through2.obj(
//     async function (file, _enc, callback) {
//       if (file.isDirectory()) {
//         return callback();
//       }
//       if (file.isNull()) {
//         logErr(file.path + ' is null');
//         return callback();
//       }
//       if (file.isStream()) {
//         logErr(file.path + ' is stream');
//         return callback();
//       }

//       if (config) {
//         // process markdown files
//         if (file.extname === '.md') {
//           // log('copying ' + file.path.replace(process.cwd(), ''));
//           const compile = await processSinglePost(file.path);
//           if (typeof compile === 'string') {
//             file.contents = Buffer.from(compile);
//             this.push(file);
//             forceGc();
//             callback();
//           } else {
//             callback();
//           }
//         } else {
//           this.push(file);
//           forceGc();
//           callback();
//         }
//       } else {
//         Logger.log('options not configured');
//         callback();
//       }
//     }
//     /*function (cb) {
//       this.emit('end', 2);
//       cb();
//     }*/
//   );
// }

/**
 * process single markdown post
 * @param file file path or contents
 * @param callback
 * @returns
 */
export async function processSinglePost(
  options: { file: string; content?: string | null },
  callback?: (parsed: hexoPostParser.postMap) => any
) {
  const { content, file } = options;
  const contents = content || fs.readFileSync(file, 'utf-8');
  const config = getConfig();
  // debug file
  const dfile = ansiColors.yellowBright(normalizePath(options.file.replace(config.cwd, '')));
  log('processing', dfile);
  // drop empty body
  if (contents.trim().length === 0) {
    logErr('content empty', dfile);
    return;
  }

  try {
    const parse = await hexoPostParser
      .parsePost(contents, {
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
      .catch((e: any) => Logger.log(e));

    if (parse && parse.metadata) {
      if (parse.metadata.date) {
        // skip scheduled post
        const createdDate = moment(String(parse.metadata.date));
        const today = moment(new Date());
        const diff = today.diff(createdDate);
        // log('today=' + today.format(), 'created=' + createdDate.format(), 'isGreater=' + String(diff));
        // if creation date greater than now
        // if (moment(new Date()).isAfter(createdDate)) {
        if (diff < 0) {
          log('skip scheduled post ' + dfile);
          // otherwise return null
          return;
        }
      }
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
              (parse.metadata[groupLabel] as any[])?.map((str) => {
                if (typeof str === 'string') return str.toLowerCase();
                if (Array.isArray(str)) {
                  return str.map((s) => {
                    if (typeof s === 'string') return s.toLowerCase();
                    return s;
                  });
                }
                return str;
              }) || [];
            log.extend('label').extend('lowercase')(groupLabel, parse.metadata[groupLabel]);
          }
        } else if (config.generator.verbose) {
          Logger.log(groupLabel, 'not found');
        }

        // Logger.log(groupLabel + '-' + ansiColors.greenBright('assign'), parse.metadata[groupLabel]);
      }

      if (typeof callback === 'function') {
        callback(parse);
      }

      const build = hexoPostParser.buildPost(parse);
      if (typeof build === 'string') {
        return build;
      }
    } else {
      logErr(String(parse), file);
    }
  } catch (e) {
    Logger.log(e);
  }
}
