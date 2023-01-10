import gulp from 'gulp';
import { getConfig } from 'sbg-utility/dist/config/_config';
import { cleanDb } from 'src/clean/cleanDb';
import { join } from 'upath';

/**
 * remove source/_posts
 * @param callback
 * @returns
 */
export async function cleanGeneratedPosts(callback?: gulp.TaskFunctionCallback | (() => any)) {
  const config = getConfig();
  return cleanDb(callback, [join(config.cwd, config.source_dir, '_posts')]);
}
