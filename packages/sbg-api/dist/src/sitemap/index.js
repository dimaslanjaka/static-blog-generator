'use strict';

var Bluebird = require('bluebird');
var fs = require('fs-extra');
var gulp = require('gulp');
var Hexo = require('hexo');
var hutil = require('hexo-util');
var micromatch = require('micromatch');
var nunjucks = require('nunjucks');
var sbgUtils = require('sbg-utility');
var path = require('upath');
var yoastSitemap = require('./yoast-sitemap.js');

/*
// read existing sitemap.txt
const sitemapTXT = path.join(getConfig().cwd, getConfig().public_dir || 'public', 'sitemap.txt');
let sitemaps = existsSync(sitemapTXT) ? array_remove_empty(readFileSync(sitemapTXT, 'utf-8').split(/\r?\n/gm)) : [];
*/
let sitemaps = [];
const crawled = new Set();
const env = sbgUtils.envNunjucks();
/**
 * Sitemap Generator
 * @param url url to crawl
 * @param deep crawl deeper n times
 * @returns
 */
function generateSitemap(url, deep = 0) {
    return new Bluebird((resolve) => {
        const promises = [];
        if (typeof url === 'string') {
            crawled.add(url);
            promises.push(sbgUtils.sitemapCrawlerAsync(url, {
                deep
            }));
        }
        else {
            crawled.add(sbgUtils.getConfig().url);
            promises.push(sbgUtils.sitemapCrawlerAsync(sbgUtils.getConfig().url, {
                deep
            }));
        }
        Bluebird.all(promises)
            .then((results) => {
            const mapped = {};
            results.forEach((sitemap) => {
                for (const key in sitemap) {
                    const values = sitemap[key];
                    if (key in mapped === false) {
                        mapped[key] = values;
                    }
                    else {
                        mapped[key] = sbgUtils.array_unique(values.concat(mapped[key]));
                    }
                }
            });
            // dump
            const saveto = path.join(sbgUtils.getConfig().cwd, 'tmp/dump/sitemap/sitemap.json');
            sbgUtils.writefile(saveto, JSON.stringify(mapped, null, 2));
            // return
            return mapped;
        })
            .then(async (results) => {
            sitemaps = sbgUtils.array_unique(sbgUtils.array_remove_empty(Object.values(results).flat(1).concat(sitemaps))).sort(function (a, b) {
                return a === b ? 0 : a < b ? -1 : 1;
            });
            for (let i = 0; i < deep; i++) {
                for (let ii = 0; ii < sitemaps.length; ii++) {
                    const url = sitemaps[ii];
                    if (crawled.has(url) || /.(js|ts|css|scss|txt|pdf|png|jpe?g|gif|webp)$/gi.test(url))
                        continue;
                    crawled.add(url);
                    sbgUtils.Logger.log('[depth]', ii, url);
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
function writeSitemap(callback) {
    let cb = sbgUtils.noop;
    if (callback)
        cb = () => callback(sitemaps);
    const sitemapTXT = path.join(sbgUtils.getConfig().cwd, sbgUtils.getConfig().public_dir || 'public', 'sitemap.txt');
    sbgUtils.writefile(sitemapTXT, sbgUtils.array_remove_empty(sitemaps).join('\n'));
    cb.apply(this);
}
/**
 * generate sitemap with hexo
 * @param config
 * @returns
 */
function hexoGenerateSitemap(config = sbgUtils.getConfig()) {
    return new Bluebird((resolve) => {
        const instance = new Hexo(config.cwd);
        instance.init().then(() => {
            instance.load().then(function () {
                env.addFilter('formatUrl', (str) => {
                    return hutil.full_url_for.call(instance, str);
                });
                const config = sbgUtils.setConfig(instance.config);
                // assign default config
                const sitemap = Object.assign({ rel: false, tags: false, categories: false, path: ['sitemap.txt', 'sitemap.xml'] }, config.sitemap);
                // Build Yoast SEO sitemap
                // when config.yoast defined
                if (sitemap.yoast) {
                    return yoastSitemap.yoastSeo(instance);
                }
                if (!config.sitemap)
                    return sbgUtils.Logger.log('[sitemap] config.sitemap not configured in _config.yml');
                const locals = instance.locals;
                const skip_render = config.skip_render;
                if (!sitemap.tags || !sitemap.categories) {
                    return sbgUtils.Logger.log('[sitemap] config.sitemap.tags or config.sitemap.categories not configured in _config.yml');
                }
                const skipRenderList = ['**/*.js', '**/*.css', '**/.git*'];
                if (Array.isArray(skip_render)) {
                    skipRenderList.push(...skip_render);
                }
                else if (typeof skip_render === 'string') {
                    if (skip_render.length > 0) {
                        skipRenderList.push(skip_render);
                    }
                }
                const posts = [...locals.get('pages').toArray(), ...locals.get('posts').toArray()]
                    .filter((post) => {
                    return post.sitemap !== false && !isMatch(post.source, skipRenderList);
                })
                    .sort((a, b) => {
                    if (b.updated && a.updated)
                        return b.updated.toDate().getTime() - a.updated.toDate().getTime();
                    return 0;
                });
                if (posts.length <= 0) {
                    return resolve();
                }
                const tmplSrc = path.join(__dirname, '_config_template_sitemap.xml');
                const template = nunjucks.compile(fs.readFileSync(tmplSrc).toString(), env);
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
                console.log('sitemap.xml written', sbgUtils.writefile(path.join(config.cwd, 'tmp/dump/sitemap/sitemap.xml'), data).file);
                // write
                const sitemapXml = path.join(config.cwd, config.public_dir, 'sitemap.xml');
                sbgUtils.writefile(sitemapXml, data);
                instance.log.info('sitemap written', sitemapXml);
                if (!relCfg)
                    return resolve();
                const baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
                const publicDir = path.join(config.cwd, config.public_dir);
                gulp
                    .src('**/*.html', { cwd: publicDir, ignore: sbgUtils.commonIgnore })
                    .pipe(sbgUtils.gulpDom(function () {
                    // auto discovery sitemap
                    if (this.querySelectorAll(`link[href="${baseURL}sitemap.xml"]`).length === 0 &&
                        this.querySelectorAll(`link[href="/sitemap.xml"]`).length === 0) {
                        this.head.innerHTML += `<link id="sitemap-site-url" type="application/text+xml" rel="sitemap" href="${baseURL}sitemap.xml" />`;
                    }
                    //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
                }))
                    .pipe(gulp.dest(publicDir))
                    .once('end', () => resolve());
            });
        });
    });
}
/**
 * is string matched pattern (using micromatch)
 * @param str
 * @param patterns
 * @returns
 */
function isMatch(str, patterns) {
    return micromatch.isMatch(str, patterns);
}

exports.generateSitemap = generateSitemap;
exports.hexoGenerateSitemap = hexoGenerateSitemap;
