import xmlplugin from '@prettier/plugin-xml';
import Bluebird from 'bluebird';
import { mkdirpSync, readFileSync, writeFile } from 'fs-extra';
import gulp from 'gulp';
import { default as hexo } from 'hexo';
import { encodeURL, full_url_for } from 'hexo-util';
import micromatch from 'micromatch';
import nunjucks from 'nunjucks';
import prettier from 'prettier';
import { sitemapCrawlerAsync } from 'sitemap-crawler';
import { dirname, join } from 'upath';
import ProjectConfig from './gulp.config';
import { deployConfig } from './gulp.deploy';
import { array_remove_empty, array_unique } from './utils/array';
import noop from './utils/noop';

const { deployDir } = deployConfig();
const originfile = join(process.cwd(), 'public/sitemap.txt');
const sitemapTXT = join(deployDir, 'sitemap.txt');
let sitemaps = array_remove_empty(readFileSync(originfile, 'utf-8').split(/\r?\n/gm));
const crawled = new Set<string>();
const env = new nunjucks.Environment();
env.addFilter('uriencode', (str) => {
  return encodeURL(str);
});
env.addFilter('noControlChars', (str) => {
  return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
});
// Extract date from datetime
env.addFilter('formatDate', (input: import('moment-timezone').Moment) => {
  return input.toISOString().substring(0, 10);
});

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

        data = prettier.format(data, { parser: 'xml', plugins: [xmlplugin] });

        writeFile(join(__dirname, '../tmp/sitemap.xml'), data, noop);
        writeFile(join(process.cwd(), config.public_dir, 'sitemap.xml'), data, resolve);
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
