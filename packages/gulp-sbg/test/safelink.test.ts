import { toUnix } from 'upath';
process.cwd = () => toUnix(__dirname);

// stay here
import '../src/gulp.post';
import '../src/gulp.safelink';
// stay here

import gulp from 'gulp';
import { copyToDeployDir, renderHtmlToSource } from './utils';

gulp.series('copy-posts')(function () {
  console.log('[copy] done');
  renderHtmlToSource().once('end', function () {
    copyToDeployDir().once('end', function () {
      console.log('[copy deploy] done');

      gulp.series('safelink')(function () {
        console.log('[safelink] done');
      });
    });
  });
});
