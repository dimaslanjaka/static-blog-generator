import Bluebird from 'bluebird';
import { existsSync, mkdirpSync, readFileSync, writeFile } from 'fs-extra';
import gulp from 'gulp';
import gulpDom from 'gulp-dom';
import { default as hexo } from 'hexo';
import { full_url_for } from 'hexo-util';
import micromatch from 'micromatch';
import nunjucks from 'nunjucks';
import { sitemapCrawlerAsync } from 'sitemap-crawler';
import { dirname, join } from 'upath';
import ProjectConfig, { commonIgnore } from './gulp.config';
import { array_remove_empty, array_unique } from './utils/array';
import noop from './utils/noop';
import envNunjucks from './utils/nunjucks-env';

const sitemapTXT = join(process.cwd(), ProjectConfig.public_dir, 'sitemap.txt');
let sitemaps = existsSync(sitemapTXT) ? array_remove_empty(readFileSync(sitemapTXT, 'utf-8').split(/\r?\n/gm)) : [];
const crawled = new Set<string>();
const env = envNunjucks();

/**
 * Sitemap Generator
 * @param url url to crawl
 * @param deep crawl deeper n times
 * @returns
 */
export function generateSitemap(url?: string | null | undefined, deep = 0) {
  return new Bluebird((resolve: (sitemaps: string[]) => any) => {
    const promises: Bluebird<Record<string, string[]>>[] = [];
    if (typeof url === 'string') {
      crawled.add(url);
      promises.push(
        sitemapCrawlerAsync(url, {
          deep
        })
      );
    } else {
      crawled.add(ProjectConfig.url);
      promises.push(
        sitemapCrawlerAsync(ProjectConfig.url, {
          deep
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
        sitemaps = array_unique(array_remove_empty(Object.values(results).flat(1).concat(sitemaps))).sort(function (
          a,
          b
        ) {
          return a === b ? 0 : a < b ? -1 : 1;
        });

        for (let i = 0; i < deep; i++) {
          for (let ii = 0; ii < sitemaps.length; ii++) {
            const url = sitemaps[ii];
            if (crawled.has(url) || /.(js|ts|css|scss|txt|pdf|png|jpe?g|gif|webp)$/gi.test(url)) continue;

            crawled.add(url);
            console.log('[depth]', ii, url);
            await generateSitemap(url, deep).then(() => writeSitemap());
          }
        }

        writeSitemap(resolve);
      });
  });
}

/**
 * write the sitemap
 * @param callback
 */
function writeSitemap(callback?: CallableFunction) {
  let cb: CallableFunction = noop;
  if (callback) cb = () => callback(sitemaps);
  writeFile(sitemapTXT, array_remove_empty(sitemaps).join('\n'), () => cb());
}

export function hexoGenerateSitemap() {
  return new Bluebird((resolve) => {
    const instance = new hexo(process.cwd());
    instance.init().then(() => {
      instance.load().then(function () {
        env.addFilter('formatUrl', (str) => {
          return full_url_for.call(instance, str);
        });
        const config = instance.config;
        const locals = instance.locals;
        const { skip_render, sitemap } = config;
        const skipRenderList = ['**/*.js', '**/*.css'];

        if (Array.isArray(skip_render)) {
          skipRenderList.push(...skip_render);
        } else if (typeof skip_render === 'string') {
          if (skip_render.length > 0) {
            skipRenderList.push(skip_render);
          }
        }

        const posts = [...locals.get('pages').toArray(), ...locals.get('posts').toArray()]
          .filter((post) => {
            return post.sitemap !== false && !isMatch(post.source, skipRenderList);
          })
          .sort((a, b) => {
            if (b.updated && a.updated) return b.updated.toDate().getTime() - a.updated.toDate().getTime();
            return 0;
          });

        if (posts.length <= 0) {
          return resolve();
        }

        const tmplSrc = join(__dirname, '_config_template_sitemap.xml');
        const template = nunjucks.compile(readFileSync(tmplSrc, 'utf-8'), env);
        const { tags: tagsCfg, categories: catsCfg } = sitemap;
        let data = template.render({
          config,
          posts,
          sNow: new Date(),
          tags: tagsCfg ? locals.get('tags').toArray() : [],
          categories: catsCfg ? locals.get('categories').toArray() : []
        });

        // remove blank newlines
        data = data.replace(/^\s*[\r\n]/gm, '\n');

        //data = prettier.format(data, { parser: 'xml', plugins: [xmlplugin], endOfLine: 'lf' });

        writeFile(join(__dirname, '../tmp/sitemap.xml'), data, noop);
        writeFile(join(process.cwd(), config.public_dir, 'sitemap.xml'), data, noop);

        const baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
        const publicDir = join(process.cwd(), config.public_dir);
        gulp
          .src('**/*.html', { cwd: publicDir, ignore: commonIgnore })
          .pipe(
            gulpDom(function () {
              // auto discovery sitemap
              if (this.querySelectorAll(`link[href="${baseURL}sitemap.xml"]`).length === 0) {
                this.head.innerHTML += `<link id="sitemap-site-url" type="application/text+xml" rel="sitemap" href="${baseURL}sitemap.xml" />`;
              }
              //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
            })
          )
          .pipe(gulp.dest(publicDir))
          .once('end', () => resolve());
      });
    });
  });
}

function isMatch(path: string, patterns: string | readonly string[]) {
  return micromatch.isMatch(path, patterns);
}

gulp.task('sitemap', () => {
  return new Bluebird((resolve) => {
    hexoGenerateSitemap().then(function () {
      resolve();
    });
  });
});
