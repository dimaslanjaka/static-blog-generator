import gulp from 'gulp';
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

// [task] DEFAULT
gulp.task('default', gulp.series('copy', 'generate'));

//export default {};
export {
  clean_db,
  clean_posts,
  clean_public,
  clean_tmp
} from './gulp/tasks/clean';
export { copyAssets } from './gulp/tasks/copy/assets';
export { copyPosts } from './gulp/tasks/copy/posts';
export { dump } from './gulp/tasks/dump';
export {
  buildPost,
  DeepPartial,
  ParseOptions,
  parsePost,
  postMap,
  postMeta
} from './parser/post/parsePost';
export { getConfig } from './types/_config';
