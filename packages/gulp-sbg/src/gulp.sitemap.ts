import Bluebird from 'bluebird';
import { mkdirpSync, readFileSync, writeFile } from 'fs-extra';
import gulp from 'gulp';
import { sitemapCrawlerAsync } from 'sitemap-crawler';
import { dirname, join } from 'upath';
import ProjectConfig from './gulp.config';
import { deployConfig } from './gulp.deploy';
import { array_unique } from './utils/array';

const { deployDir } = deployConfig();
const originfile = join(process.cwd(), 'public/sitemap.txt');
const sitemapTXT = join(deployDir, 'sitemap.txt');
let sitemaps = readFileSync(originfile, 'utf-8').split(/\r?\n/gm);
const crawled = new Set<string>();

/**
 * Sitemap Generator
 * @param url url to crawl
 * @param depth crawl deeper n times
 * @returns
 */
export function generateSitemap(url?: string | null | undefined, depth = 0) {
  return new Bluebird((resolve: (sitemaps: string[]) => any) => {
    const promises: Bluebird<Record<string, string[]>>[] = [];
    if (typeof url === 'string') {
      crawled.add(url);
      promises.push(
        sitemapCrawlerAsync(url, {
          deep: 2
        })
      );
    } else {
      crawled.add(ProjectConfig.url);
      promises.push(
        sitemapCrawlerAsync(ProjectConfig.url, {
          deep: 2
        })
      );
    }
    Bluebird.all(promises)
      .then((results) => {
        const saveto = join(__dirname, '../tmp/sitemap.json');
        mkdirpSync(dirname(saveto));
        const mapped = {} as ReturnType<typeof sitemapCrawlerAsync>;
        results.forEach((sitemap) => {
          for (const key in sitemap) {
            const values = sitemap[key];
            if (key in mapped === false) {
              mapped[key] = values;
            } else {
              mapped[key] = array_unique(values.concat(mapped[key]));
            }
          }
        });
        // writeFileSync(saveto, JSON.stringify(mapped, null, 2));
        return mapped;
      })
      .then(async (results) => {
        sitemaps = array_unique(
          Object.values(results)
            .flat(1)
            .concat(sitemaps)
            .filter(function (x, i, a) {
              return a.indexOf(x) === i && typeof x == 'string' && x.length > 0;
            })
        ).sort(function (a, b) {
          return a === b ? 0 : a < b ? -1 : 1;
        });

        for (let i = 0; i < depth; i++) {
          for (let ii = 0; ii < sitemaps.length; ii++) {
            const url = sitemaps[ii];
            if (crawled.has(url)) continue;

            crawled.add(url);
            await generateSitemap(url, depth);
          }
        }

        return sitemaps;
      })
      .then(() => writeFile(sitemapTXT, sitemaps.join('\n'), () => resolve(sitemaps)));
  });
}

gulp.task('sitemap', () => generateSitemap(null, 2));
