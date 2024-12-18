import gulp from 'gulp';
import { getConfig } from 'sbg-utility';
import path from 'upath';
import { cleanDb } from './cleanDb';

/**
 * remove source/_posts and hexo-post-parser caches
 * @param callback
 * @returns
 */
export async function cleanGeneratedPosts(callback?: gulp.TaskFunctionCallback | (() => any)) {
  const config = getConfig();
  return cleanDb(callback, [
    path.join(config.cwd, config.source_dir, '_posts'),
    path.join(config.cwd, 'tmp/hexo-post-parser')
  ]);
}
