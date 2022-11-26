import GulpClient from 'gulp';
import gulpDom from 'gulp-dom';
import { deployConfig } from './gulp.config';

/**
 * Auto seo runner
 * @param cwd directory to scan htmls
 */
export function autoSeo(cwd: string) {
  return GulpClient.src('**/*.{htm,html}', { cwd })
    .pipe(
      gulpDom(function (path) {
        console.log(path);
      })
    )
    .pipe(GulpClient.dest(cwd));
}

GulpClient.task('seo', function () {
  const { deployDir } = deployConfig();
  return autoSeo(deployDir);
});
