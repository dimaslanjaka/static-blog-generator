import { join, toUnix } from 'upath';
process.cwd = () => toUnix(__dirname);

// stay here
import '../src/gulp.post';
import '../src/gulp.safelink';
// stay here

import gulp from 'gulp';

const publicDIR = join(__dirname, 'public');
const deployDIR = join(__dirname, '.deploy_git');

gulp.series('copy-posts')(function () {
  console.log('[copy] done');
  gulp
    .src(['*.html', '**/*.html'], { cwd: publicDIR })
    .pipe(gulp.dest(deployDIR))
    .once('end', function () {
      console.log('[copy deploy] done');
      gulp.series('safelink')(function () {
        console.log('[safelink] done');
      });
    });
});
