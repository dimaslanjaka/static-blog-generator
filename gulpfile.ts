import gulp from 'gulp';
import { commitProject, getUntrackedSitemap } from 'gulp-sbg';

gulp.task('sitemap', getUntrackedSitemap);
gulp.task('project-commit', commitProject);

export default gulp;
