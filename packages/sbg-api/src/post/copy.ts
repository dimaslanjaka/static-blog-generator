import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import gulp from 'gulp';
import { debug, escapeRegex, getConfig, gulpCached, md5 } from 'sbg-utility';
import through2 from 'through2';
import path from 'upath';
import { gulpOpt } from '../gulp-options';
import { forceGc } from '../utils/gc';
import { removeCwd } from '../utils/path';
import { parseMarkdownPost } from './copy-utils';
import getSourcePosts, { getSourceAssets } from './get-source-posts';

/**
 * log debug
 *
 * @example
 * cross-env-shell DEBUG=* "your commands"
 */
const log = debug('post');
const logErr = log.extend('error');

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
export async function promiseCopy(config?: ReturnType<typeof getConfig>): Promise<void> {
  if (!config) config = getConfig();
  const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
  const posts = await getSourcePosts(config);
  const assets = await getSourceAssets(config);

  /**
   * Process a markdown file
   *
   * @param file The file path to process
   */
  const processMarkdown = async function (file: string) {
    const cacheId = md5(file);
    const cachePath = path.join(config.cwd, 'tmp/hexo-post-parser/processMarkdown', cacheId + '.md');
    await fs.ensureDir(path.dirname(cachePath));
    // skip already copied post
    if (await fs.exists(cachePath)) return;

    log('Processing', file);

    const content = Buffer.from(await fs.readFile(file)).toString(); // Read file content
    const compile = await parseMarkdownPost({ content, file }, config).catch(() => null); // Process content

    if (typeof compile === 'string') {
      const { post_dir = 'src-posts' } = config;
      const regex = new RegExp(`[\\/\\\\]${escapeRegex(post_dir)}[\\/\\\\]`);
      const fileWithoutCwd = removeCwd(file).replace(regex, '');
      const dest = path.join(generatedPostDir, fileWithoutCwd); // Generate destination path
      // Ensure the destination directory exists
      await fs.ensureDir(path.dirname(dest));
      // Write the compiled markdown directly to the destination file
      await fs.writeFile(dest, compile, 'utf-8');
      await fs.writeFile(cachePath, compile);
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

  log('Processing', posts.length, 'post(s)');

  // Process posts one by one using posts.shift() elimination strategy
  while (posts.length > 0) {
    const post = posts.shift()!;
    if (typeof post !== 'string') continue;

    try {
      const stat = await fs.stat(post).catch(() => null);
      if (stat && stat.isDirectory()) {
        continue;
      }
      await processMarkdown(post);

      // Trigger garbage collection if possible
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      console.error(error);
    }
  }

  while (assets.length > 0) {
    const file = assets.shift();
    if (file) {
      await processAssets(file);
    }
  }
}

/**
 * copy all posts from src-posts to source/_posts
 * @returns
 */
export function streamCopy(_callback?: gulp.TaskFunctionCallback, config?: ReturnType<typeof getConfig>) {
  if (!config) config = getConfig();
  const excludes = config.exclude || [];
  const sourcePostDir = path.join(config.cwd, config.post_dir);
  const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
  // console.log(excludes, sourcePostDir);
  return gulp
    .src(['**/*.*', '*.*', '**/*'], {
      cwd: sourcePostDir,
      ignore: excludes,
      dot: true,
      noext: true
    } as gulpOpt)
    .pipe(gulpCached({ name: 'post-copy', cwd: config.cwd }))
    .pipe(pipeProcessPost(config))
    .pipe(gulp.dest(generatedPostDir));
}

/**
 * pipeable function to process post
 * @param config
 * @returns
 */
export function pipeProcessPost(config: ReturnType<typeof getConfig>) {
  const logname = 'post:' + ansiColors.blueBright('processing');
  if (config.generator.verbose) {
    log(logname, 'cache=' + (config.generator.cache ? ansiColors.green('true') : ansiColors.red('false')));
  }
  return through2.obj(
    async function (file, _enc, callback) {
      if (file.isDirectory()) {
        return callback();
      }
      if (file.isNull()) {
        logErr(file.path + ' is null');
        return callback();
      }
      if (file.isStream()) {
        logErr(file.path + ' is stream');
        return callback();
      }
      if (config) {
        // process markdown files
        if (file.extname === '.md') {
          // log('copying ' + file.path.replace(process.cwd(), ''));
          const compile = await parseMarkdownPost(
            {
              file: file.path,
              content:
                typeof file.contents === 'string'
                  ? file.contents
                  : Buffer.isBuffer(file.contents)
                    ? Buffer.from(file.contents).toString()
                    : undefined
            },
            config
          );
          if (typeof compile === 'string') {
            file.contents = Buffer.from(compile);
            this.push(file);
            forceGc();
            callback();
          } else {
            callback();
          }
        } else {
          this.push(file);
          forceGc();
          callback();
        }
      } else {
        logErr('options not configured');
        callback();
      }
    }
    /*function (cb) {
      this.emit('end', 2);
      cb();
    }*/
  );
}
