import gulp from 'gulp';
import { copyAssets } from './assets';
import { copyPosts } from './posts';
import { gulpInlineStyle } from './remove-inline-style';

// COPY TASKS
gulp.task('copy:assets', () => copyAssets());
gulp.task('copy:posts', () => copyPosts());
gulp.task('copy:remove-inline-style', () => gulpInlineStyle());
gulp.task('copy', gulp.series('copy:assets', 'copy:posts'));
gulp.task('copy:blogger', gulp.series('copy', 'copy:remove-inline-style'));
