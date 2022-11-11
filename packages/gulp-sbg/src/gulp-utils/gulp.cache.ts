import crypto from 'crypto';
import fs from 'fs';
import { persistentCache } from 'persistent-cache';
import through2 from 'through2';

/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
export function calculateHash(file: string) {
  const testFile = fs.readFileSync(file);
  const sha1sum = crypto.createHash('sha1').update(testFile).digest('hex');
  return sha1sum;
}

/**
 *
 * @param options
 * @returns
 */
export function gulpCached(options: Parameters<typeof persistentCache>[0] = { name: 'gulp-cached' }) {
  const caches = persistentCache(options);
  return through2.obj(function (file, _enc, next) {
    const hasCache = caches.getSync(file.path);
    const sha1sum = calculateHash(file.path);

    if (!hasCache) {
      caches.setSync(file.path, sha1sum);
      return next(null, file);
    } else {
      console.log('cached');
    }
    return next(null, file);
  });
}
