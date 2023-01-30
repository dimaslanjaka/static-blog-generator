import gulp from 'gulp';
import cleanArchive from './cleanArchive';
import { cleanDb } from './cleanDb';
import { cleanGeneratedPosts } from './cleanGeneratedPosts';

gulp.task('clean:db', cleanDb);
gulp.task('clean:post', cleanGeneratedPosts);
gulp.task('clean:archive', cleanArchive);
gulp.task('clean:all', gulp.series('clean:db', 'clean:archive'));

export { cleanDb, cleanArchive, cleanGeneratedPosts };
