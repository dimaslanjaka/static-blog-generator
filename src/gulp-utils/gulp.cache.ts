import crypto from 'crypto';
import fs from 'fs';
import { persistentCache } from 'persistent-cache';
import through2 from 'through2';
import { join } from 'upath';
import { getConfig } from '../gulp.config';

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
};

/**
 * * [source idea](https://github.com/gulp-community/gulp-cached/blob/8e8d13cb07b17113ff94700e87f136eeaa1f1340/index.js#L35-L44)
 * @param options
 * @returns
 */
export function gulpCached(options: gulpCachedOpt = {}) {
  const config = getConfig();
  options = Object.assign({ name: 'gulp-cached', base: join(config.cwd, 'tmp'), prefix: '' }, options);
  const caches = persistentCache(options);
  return through2.obj(function (file, _enc, next) {
    // skip directory
    if (file.isDirectory()) return next(null, file);

    const cacheKey = md5(file.path);
    const getCache = caches.getSync(cacheKey);
    const sha1sum = getShaFile(file.path);

    if (!getCache || sha1sum !== getCache) {
      caches.setSync(cacheKey, sha1sum);
      // push modified file
      if (typeof this.push === 'function') this.push(file);
      return next();
    } else {
      // drop non-modified data
      return next();
    }
  });
}

export default gulpCached;
