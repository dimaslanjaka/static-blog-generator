import './gulpfile';
import scheduler from './utils/scheduler';

export { copyAllPosts, copyPost, copySinglePost, watchPost } from './gulp.post';
export { commitProject, getUntrackedSitemap } from './gulpfile';

scheduler.register();
