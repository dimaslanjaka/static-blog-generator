import Bluebird from 'bluebird';
import { readFileSync, writeFile, writeFileSync } from 'fs-extra';
import gulp from 'gulp';
import { sitemapCrawlerAsync } from 'sitemap-crawler';
import { join } from 'upath';
import { deployConfig } from './gulp.deploy';

export function generateSitemap() {
  return new Bluebird((resolve) => {
    const { deployDir } = deployConfig();
    const originfile = join(process.cwd(), 'public/sitemap.txt');
    const outfile = join(deployDir, 'sitemap.txt');
    let sitemaps = readFileSync(originfile, 'utf-8').split(/\r?\n/gm);
    Bluebird.all([
      sitemapCrawlerAsync('https://www.webmanajemen.com/chimeraland', {
        deep: 2
      }),
      sitemapCrawlerAsync('https://www.webmanajemen.com', {
        deep: 2
      })
    ]).then((results) => {
      writeFileSync(join(__dirname, '../tmp/sitemap.json'), JSON.stringify(results.flat(), null, 2));
    });
    sitemapCrawlerAsync('https://www.webmanajemen.com', {
      deep: 2
    })
      .then((results) => {
        return new Bluebird((resolve: (sitemap: Record<string, any>) => any) => {
          sitemapCrawlerAsync('https://www.webmanajemen.com/chimeraland', {
            deep: 2
          }).then((chimera) => {
            resolve(Object.assign(chimera, results));
          });
        });
      })
      .then((results) => {
        sitemaps = Object.values(results)
          .flat(1)
          .concat(sitemaps)
          .filter(function (x, i, a) {
            return a.indexOf(x) === i && typeof x == 'string' && x.length > 0;
          })
          .sort(function (a, b) {
            return a === b ? 0 : a < b ? -1 : 1;
          });
        writeFile(outfile, sitemaps.join('\n'), resolve);
      });
  });
}

gulp.task('sitemap', generateSitemap);
