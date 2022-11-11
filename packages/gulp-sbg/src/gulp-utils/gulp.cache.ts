import crypto from 'crypto';
import fs from 'fs';
import { persistentCache } from 'persistent-cache';
import through2 from 'through2';
import { join } from 'upath';

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

export const md5 = (data: string) => crypto.createHash('md5').update(data).digest('hex');

/**
 *
 * @param options
 * @returns
 */
export function gulpCached(options: Parameters<typeof persistentCache>[0] = {}) {
  options = Object.assign(options, { name: 'gulp-cached', base: join(process.cwd(), 'tmp') });
  const caches = persistentCache(options);
  return through2.obj(function (file, _enc, next) {
    // skip directory
    if (file.isDirectory()) return next(null, file);

    const cacheKey = md5(file.path);
    const hasCache = caches.getSync(cacheKey);
    const sha1sum = getShaFile(file.path);

    if (!hasCache) {
      caches.setSync(cacheKey, sha1sum);
      return next(null, file);
    } else {
      console.log('cached');
    }
    return next(null, file);
  });
}
