import Bluebird from 'bluebird';
import { readFileSync } from 'fs-extra';
import gulp from 'gulp';
import gulpDom from 'gulp-dom';
import { default as hexo } from 'hexo';
import { full_url_for } from 'hexo-util';
import micromatch from 'micromatch';
import nunjucks from 'nunjucks';
import { EOL } from 'os';
import { commonIgnore, getConfig, setConfig } from 'sbg-utility/dist/config/_config';
import { envNunjucks, noop } from 'sbg-utility/dist/utils';
import { array_remove_empty, array_unique } from 'sbg-utility/dist/utils/array';
import { writefile } from 'sbg-utility/dist/utils/fm';
import Logger from 'sbg-utility/dist/utils/logger';
import { sitemapCrawlerAsync } from 'sitemap-crawler';
import { join } from 'upath';
import { yoastSeo } from './sitemap';

/*
// read existing sitemap.txt
const sitemapTXT = join(getConfig().cwd, getConfig().public_dir || 'public', 'sitemap.txt');
let sitemaps = existsSync(sitemapTXT) ? array_remove_empty(readFileSync(sitemapTXT, 'utf-8').split(/\r?\n/gm)) : [];
*/
let sitemaps = [] as string[];
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
      crawled.add(getConfig().url);
      promises.push(
        sitemapCrawlerAsync(getConfig().url, {
          deep
        })
      );
    }
    Bluebird.all(promises)
      .then((results) => {
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

        // dump
        const saveto = join(process.cwd(), 'tmp/dump/sitemap/sitemap.json');
        writefile(saveto, JSON.stringify(mapped, null, 2));

        // return
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
            Logger.log('[depth]', ii, url);
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
function writeSitemap(callback?: (...args: any[]) => any) {
  let cb = noop;
  if (callback) cb = () => callback(sitemaps);
  const sitemapTXT = join(getConfig().cwd, getConfig().public_dir || 'public', 'sitemap.txt');
  writefile(sitemapTXT, array_remove_empty(sitemaps).join(EOL));
  cb.apply(this);
}

export interface SitemapOptions {
  path: string[];
  tags: boolean;
  categories: boolean;
  rel: boolean;
  yoast: boolean;
}

export function hexoGenerateSitemap() {
  return new Bluebird((resolve) => {
    const instance = new hexo(getConfig().cwd);
    instance.init().then(() => {
      instance.load().then(function () {
        env.addFilter('formatUrl', (str) => {
          return full_url_for.call(instance, str);
        });
        const config = setConfig(instance.config);
        // assign default config
        const sitemap: SitemapOptions = Object.assign(
          { rel: false, tags: false, categories: false, path: ['sitemap.txt', 'sitemap.xml'] },
          config.sitemap
        );

        // Build Yoast SEO sitemap
        // when config.yoast defined
        if (sitemap.yoast) {
          return yoastSeo(instance);
        }

        if (!config.sitemap) return Logger.log('[sitemap] config.sitemap not configured in _config.yml');
        const locals = instance.locals;
        const { skip_render } = config;

        if (!sitemap.tags || !sitemap.categories) {
          return Logger.log('[sitemap] config.sitemap.tags or config.sitemap.categories not configured in _config.yml');
        }
        const skipRenderList = ['**/*.js', '**/*.css', '**/.git*'];

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
        const { tags: tagsCfg, categories: catsCfg, rel: relCfg } = sitemap;
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

        // dump
        writefile(join(process.cwd(), 'tmp/dump/sitemap/sitemap.xml'), data);

        // write
        const sitemapXml = join(getConfig().cwd, config.public_dir, 'sitemap.xml');
        writefile(sitemapXml, data);
        instance.log.info('sitemap written', sitemapXml);

        if (!relCfg) return resolve();
        const baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
        const publicDir = join(getConfig().cwd, config.public_dir);
        gulp
          .src('**/*.html', { cwd: publicDir, ignore: commonIgnore })
          .pipe(
            gulpDom(function () {
              // auto discovery sitemap
              if (
                this.querySelectorAll(`link[href="${baseURL}sitemap.xml"]`).length === 0 &&
                this.querySelectorAll(`link[href="/sitemap.xml"]`).length === 0
              ) {
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
