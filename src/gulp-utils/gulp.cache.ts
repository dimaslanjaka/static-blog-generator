import crypto from 'crypto';
import fs, { appendFileSync, existsSync } from 'fs';
import { persistentCache } from 'persistent-cache';
import internal from 'stream';
import through2 from 'through2';
import { join, toUnix } from 'upath';
import { getConfig } from '../gulp.config';
import scheduler from '../utils/scheduler';

/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
export function getShaFile(file: string) {
  if (fs.statSync(file).isDirectory()) return null;
  const testFile = fs.readFileSync(file);
  const sha1sum = crypto.createHash('sha1').update(testFile).digest('hex');
  return sha1sum;
}

/**
 * MD5 hash generator
 * @param data
 * @returns
 */
export const md5 = (data: string) => crypto.createHash('md5').update(data).digest('hex');

export type gulpCachedOpt = Parameters<typeof persistentCache>[0] & {
  prefix?: string;
  /**
   * dest folder
   * * required cwd option
   * * ~cannot match different extension
   */
  dest?: string;
  /**
   * cwd source
   * * required dest option
   * * ~cannot match different extension
   */
  cwd?: string;
  /**
   * verbose
   */
  verbose?: boolean;
};

export function gulpCached(options: gulpCachedOpt & { dest?: string; cwd?: string }): internal.Transform;

/**
 * * [source idea](https://github.com/gulp-community/gulp-cached/blob/8e8d13cb07b17113ff94700e87f136eeaa1f1340/index.js#L35-L44)
 * @param options
 * @returns
 */
export function gulpCached(options: gulpCachedOpt = {}): internal.Transform {
  const config = getConfig();
  options = Object.assign({ name: 'gulp-cached', base: join(config.cwd, 'tmp'), prefix: '' }, options);
  const caches = persistentCache(options);
  return through2.obj(function (file, _enc, next) {
    // skip directory
    if (file.isDirectory()) return next(null, file);

    const cacheKey = md5(file.path);
    const getCache = caches.getSync(cacheKey, '');
    const sha1sum = getShaFile(file.path);
    let isCached = typeof getCache === 'string' && getCache.trim().length > 0 && sha1sum === getCache;
    const paths = {
      dest: toUnix(options.dest?.replace(process.cwd(), '') || ''),
      cwd: toUnix(options.cwd?.replace(process.cwd(), '') || ''),
      source: toUnix(file.path.replace(process.cwd(), ''))
    };

    // check destination
    if (options.dest && options.cwd) {
      const destPath = join(toUnix(options.dest), toUnix(file.path).replace(toUnix(options.cwd), ''));
      if (!existsSync(destPath)) isCached = false;
      // Logger.log('dest', destPath, 'cached', isCached);
    }

    // Logger.log(paths.source, 'cached', isCached);
    // dump
    const dumpfile = join(process.cwd(), 'tmp/dump/gulp-cache.txt');
    appendFileSync(
      dumpfile,
      `${paths.source} is cached ${isCached} with dest validation ${options.dest && options.cwd}`
    );

    scheduler.add('dump gulp-cache', () => console.log('dump gulp-cache', dumpfile));

    if (!isCached) {
      // not cached
      caches.setSync(cacheKey, sha1sum);
      // push modified file
      if (typeof this.push === 'function') this.push(file);
      return next();
    } else {
      // cached
      // drop non-modified data
      return next();
    }
  });
}

export default gulpCached;
