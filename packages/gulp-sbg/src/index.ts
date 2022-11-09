import './gulpfile';
import scheduler from './utils/scheduler';

export { copyAllPosts, copySinglePost, updatePost as copyPost, watchPost } from './gulp.post';
export { generateSitemap } from './gulp.sitemap';
export { commitProject } from './gulpfile';

scheduler.register();
