import gulp from 'gulp';
import { getConfig } from 'sbg-utility';
import { join } from 'upath';
import { cleanDb } from './cleanDb';

/**
 * remove source/_posts
 * @param callback
 * @returns
 */
export async function cleanGeneratedPosts(callback?: gulp.TaskFunctionCallback | (() => any)) {
  const config = getConfig();
  return cleanDb(callback, [join(config.cwd, config.source_dir, '_posts')]);
}
