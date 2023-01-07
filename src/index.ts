import gulp from 'gulp';
import SBG from './api';

export { default as Application } from './api';
export { default as gulpCached } from './gulp-utils/gulp.cache';
export { default as gulpDebug } from './gulp-utils/gulp.debug';
export { cleanDb, del, del as deleteDir } from './gulp.clean';
export { deployConfig, getConfig, setConfig } from './gulp.config';
export { taskSeo as autoSeo } from './gulp.seo';
export { generateSitemap, hexoGenerateSitemap } from './gulp.sitemap';
export { default as standaloneRunner } from './gulp.standalone';
export { commitProject, default as gulp } from './gulpfile';
export { copyAllPosts, copySinglePost } from './post/copy';
export { updatePost } from './post/update';
export { array_random, array_remove_empty, array_unique } from './utils/array';
export { noop } from './utils/noop';
export { default as scheduler } from './utils/scheduler';

gulp.task('post:copy', function (done) {
  const api = new SBG(process.cwd());
  api.copy().then(() => done());
});
