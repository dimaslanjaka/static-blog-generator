import gulp from 'gulp';
import { join } from 'upath';
import './a-core';
import './gulp/server';
import './gulp/tasks/clean';
import './gulp/tasks/copy';
import './gulp/tasks/deploy';
import './gulp/tasks/generate';
import scheduler from './node/scheduler';

// register scheduler
new scheduler();

/**
 * @see {@link https://stackoverflow.com/a/67394338/6404439}
 */
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:\n' + err.stack + '\n');
});

// DEVELOPMENT TASKS
require(join(__dirname, 'gulp/tasks/dump'));

// DEFAULT TASK
gulp.task('default', gulp.series('copy', 'generate'));

export {
  clean_db,
  clean_posts,
  clean_public,
  clean_tmp
} from './gulp/tasks/clean';
export { copyAssets } from './gulp/tasks/copy/assets';
export { copyPosts } from './gulp/tasks/copy/posts';

export default {};
