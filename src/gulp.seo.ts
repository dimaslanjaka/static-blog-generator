import ansiColors from 'ansi-colors';
import gulp from 'gulp';
import gulpDom from 'gulp-dom';
import gulpCached from './gulp-utils/gulp.cache';
import { commonIgnore, deployConfig, getConfig } from './gulp.config';
import Logger from './utils/logger';

const console = Logger;

/**
 * Auto seo runner
 * @param cwd directory to scan htmls
 */
export function autoSeo(cwd: string) {
  const config = getConfig();
  const ignore: string[] = Array.isArray(config.exclude) ? config.exclude : [];
  ignore.push(...commonIgnore);
  return gulp
    .src(['**/*.{htm,html}', '*.{html,htm}'], { cwd, ignore })
    .pipe(gulpCached({ name: 'seo' }))
    .pipe(
      gulpDom(function (path) {
        // fix alt images
        const images = Array.from(this.querySelectorAll('img[src]'));
        images.forEach((el) => {
          const alt = el.getAttribute('alt');
          if (!alt || alt.length === 0) {
            const title = this.title + ' - ' + el.getAttribute('src') || 'No Alt';
            el.setAttribute('alt', title);
          }
        });

        // fix title iframe
        const iframes = Array.from(this.querySelectorAll('iframe[src]'));
        iframes.forEach((el) => {
          const alt = el.getAttribute('title');
          if (!alt || alt.length === 0) {
            const title = this.title + ' - ' + el.getAttribute('src') || 'No Title';
            el.setAttribute('title', title);
          }
        });

        // WARNING MAKER
        // count H1
        const h1 = this.querySelectorAll('h1');
        if (h1.length > 1) {
          console.log(ansiColors.yellowBright('[WARN]'), `H1 (${h1.length}) ${path}`);
        }
      })
    )
    .pipe(gulp.dest(cwd));
}

gulp.task('seo', function () {
  const { deployDir } = deployConfig();
  return autoSeo(deployDir);
});

export default gulp;
