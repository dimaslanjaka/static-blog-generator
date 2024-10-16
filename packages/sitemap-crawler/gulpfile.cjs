const gulp = require('gulp');

function copyDist() {
  return gulp.src('./dist/**/*').pipe(gulp.dest('./sitemap-crawler-shadow/dist'));
}

gulp.task('default', gulp.series(copyDist));
