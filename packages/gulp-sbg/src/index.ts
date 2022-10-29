import './gulpfile';
import scheduler from './utils/scheduler';

export { copyAllPosts, copySinglePost, updatePost as copyPost, watchPost } from './gulp.post';
export { commitProject, getUntrackedSitemap } from './gulpfile';

scheduler.register();
