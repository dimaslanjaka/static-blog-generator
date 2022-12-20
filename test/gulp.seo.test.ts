process.cwd = () => __dirname;

// stay here - VSCode auto organize import
import '../src/gulp.post';
import '../src/gulp.seo';
// stay here - VSCode auto organize import

import gulp from 'gulp';
import { copyToDeployDir, renderHtmlToSource } from './utils';

gulp.series('post:copy')(function () {
  console.log('[copy] done');
  renderHtmlToSource().once('end', function () {
    copyToDeployDir().once('end', function () {
      console.log('[copy deploy] done');

      gulp.series('seo')(function () {
        console.log('[seo] done');
      });
    });
  });
});
