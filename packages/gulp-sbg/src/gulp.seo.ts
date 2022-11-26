import GulpClient from 'gulp';
import gulpDom from 'gulp-dom';
import { deployConfig } from './gulp.config';

/**
 * Auto seo runner
 * @param cwd directory to scan htmls
 */
export function autoSeo(cwd: string) {
  return GulpClient.src(['**/*.{htm,html}', '*.{html,htm}'], { cwd })
    .pipe(
      gulpDom(function () {
        // fix alt images
        const images = Array.from(this.querySelectorAll('img[src]'));
        images.forEach((el) => {
          const alt = el.getAttribute('alt');
          console.log({ alt });
        });
      })
    )
    .pipe(GulpClient.dest(cwd));
}

GulpClient.task('seo', function () {
  const { deployDir } = deployConfig();
  return autoSeo(deployDir);
});
