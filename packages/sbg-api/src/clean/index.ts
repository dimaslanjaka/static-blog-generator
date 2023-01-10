import gulp from 'gulp';
import cleanArchive from 'src/clean/archive';
import { cleanDb } from './cleanDb';
import { cleanGeneratedPosts } from './generated-post';

gulp.task('clean:db', cleanDb);
gulp.task('clean:post', cleanGeneratedPosts);
gulp.task('clean:all', gulp.series('clean:db', 'clean:archive'));
gulp.task('clean:archive', cleanArchive);

export { cleanDb, cleanArchive, cleanGeneratedPosts };
