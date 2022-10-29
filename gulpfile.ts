import gulp from 'gulp';
import { commitProject, getUntrackedSitemap } from './packages/gulp-sbg/src';

gulp.task('sitemap', getUntrackedSitemap);
gulp.task('project-commit', commitProject);

export default gulp;
