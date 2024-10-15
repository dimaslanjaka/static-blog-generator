import fs from 'fs-extra';
import hexoIs from 'hexo-is';
import moment from 'moment';
import { getConfig, scheduler, writefile } from 'sbg-utility';
import path from 'upath';
import { create } from 'xmlbuilder2';
import getCategoryTags, { getLatestFromArrayDates } from './archive.js';
import yoastSeoSitemapPages from './pages.js';
import yoastSeoSitemapPosts from './posts.js';

const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const sitemapGroup = {};
function initSitemap(type) {
    if (!sitemapGroup[type]) {
        const sourceXML = path.join(__dirname, 'views/' + type + '-sitemap.xml');
        if (!fs.existsSync(sourceXML))
            throw 'Source ' + sourceXML + ' Not Found';
        const doc = create(fs.readFileSync(sourceXML).toString());
        sitemapGroup[type] = new Object(doc.end({ format: 'object' }));
        sitemapGroup[type].urlset.url = [];
    }
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
function getPageData(data) {
    const is = hexoIs(data);
    if (data && 'page' in data) {
        const page = data['page'];
        page.is = is;
        return page;
    }
}
/**
 * init each sitemap
 * @param hexo
 */
function initEachSitemap(hexo) {
    const groups = ['post', 'page', 'category', 'tag'];
    groups.forEach((group) => {
        if (!sitemapGroup[group])
            initSitemap(group);
        if (sitemapGroup[group].urlset.url.length === 0) {
            sitemapGroup[group].urlset.url.push({
                loc: hexo.config.url,
                lastmod: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
                priority: '1',
                changefreq: 'daily'
            });
        }
    });
}
let categoryTagsInfo;
const postUpdateDates = [];
const pageUpdateDates = [];
// const cache = new CacheFile("sitemap");
let turnError = false;
function yoastSeoSitemap(data) {
    const HSconfig = getConfig();
    if (!HSconfig.sitemap) {
        if (!turnError) {
            turnError = true;
            _log.error('[hexo-seo][sitemap] config sitemap not set');
        }
        return;
    }
    // set category and tag information of posts
    if (!categoryTagsInfo) {
        categoryTagsInfo = getCategoryTags(hexo);
    }
    // cast locals
    const locals = hexo.locals;
    // return if posts and pages empty
    if (['posts', 'pages'].every((info) => locals.get(info).length === 0)) {
        return;
    }
    const post = getPageData(data);
    if (post) {
        const isPagePost = post.is.post || post.is.page;
        if (isPagePost) {
            // if post updated not found, get source file last modified time
            if (!post.updated) {
                const stats = fs.statSync(post.full_source);
                post.updated = moment(stats.mtime);
            }
        }
        if (post.is.post && post.updated) {
            postUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
            sitemapGroup['post'].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                changefreq: 'weekly',
                priority: '0.6'
            });
        }
        else if (post.is.page && post.updated) {
            pageUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
            sitemapGroup['page'].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                changefreq: 'weekly',
                priority: '0.8'
            });
        }
        if (isPagePost) {
            scheduler.add('writeSitemap', () => {
                // copy xsl
                const destXSL = path.join(hexo.public_dir, 'sitemap.xsl');
                if (!fs.existsSync(path.dirname(destXSL)))
                    fs.mkdirSync(path.dirname(destXSL), { recursive: true });
                const sourceXSL = path.join(__dirname, 'views/sitemap.xsl');
                if (fs.existsSync(sourceXSL)) {
                    fs.copyFileSync(sourceXSL, destXSL);
                    _log.info('XSL sitemap copied to ' + destXSL);
                }
                else {
                    _log.error('XSL sitemap not found');
                }
                const destPostSitemap = path.join(hexo.public_dir, 'post-sitemap.xml');
                writefile(destPostSitemap, create(sitemapGroup['post']).end({ prettyPrint: true }));
                _log.info('post sitemap saved', destPostSitemap);
                const destPageSitemap = path.join(hexo.public_dir, 'page-sitemap.xml');
                writefile(destPageSitemap, create(sitemapGroup['page']).end({ prettyPrint: true }));
                _log.info('page sitemap saved', destPageSitemap);
                yoastSitemapIndex(hexo);
            });
        }
    }
}
/**
 * yoast seo sitemap builder
 * @param hexo
 */
function yoastSeo(hexo) {
    initEachSitemap(hexo);
    const { locals } = hexo;
    const emptySite = ['posts', 'pages'].every((info) => locals.get(info).length === 0);
    if (emptySite)
        return;
    // yoastSitemapIndex(hexo);
    yoastSeoSitemapPages(hexo);
    yoastSeoSitemapPosts(hexo);
}
/**
 * generate yoast
 * * path /sitemap.xml
 * @param hexo
 */
function yoastSitemapIndex(hexo) {
    const sourceIndexXML = path.join(__dirname, 'views/sitemap.xml');
    const sitemapIndexDoc = create(fs.readFileSync(sourceIndexXML).toString());
    const sitemapIndex = new Object(sitemapIndexDoc.end({ format: 'object' }));
    sitemapIndex.sitemapindex.sitemap = [];
    // push post-sitemap.xml to sitemapindex
    const latestPostDate = getLatestFromArrayDates(postUpdateDates);
    _log.info('latest updated post', String(latestPostDate));
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/post-sitemap.xml',
        lastmod: moment(latestPostDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // push page-sitemap.xml to sitemapindex
    const latestPageDate = getLatestFromArrayDates(pageUpdateDates);
    _log.info('latest updated page', String(latestPageDate));
    if (moment(latestPageDate).isValid())
        sitemapIndex.sitemapindex.sitemap.push({
            loc: hexo.config.url.toString() + '/page-sitemap.xml',
            lastmod: moment(latestPageDate).format('YYYY-MM-DDTHH:mm:ssZ')
        });
    // set category and tag information of posts
    if (!categoryTagsInfo) {
        categoryTagsInfo = getCategoryTags(hexo);
    }
    // build tag-sitemap.xml
    const tags = categoryTagsInfo.tags;
    tags.map((tag) => {
        sitemapGroup['tag'].urlset.url.push({
            loc: tag.permalink.toString(),
            // set latest post updated from this tag
            lastmod: moment(tag.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    const destTagSitemap = path.join(hexo.public_dir, 'tag-sitemap.xml');
    writefile(destTagSitemap, create(sitemapGroup['tag']).end({ prettyPrint: true }));
    _log.info('tag sitemap saved', destTagSitemap);
    // push tag-sitemap.xml to sitemapindex
    const latestTagDate = getLatestFromArrayDates(tags.map((tag) => {
        return tag.latest;
    }));
    _log.info('latest updated tag', String(latestTagDate));
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/tag-sitemap.xml',
        lastmod: moment(latestTagDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // build category-sitemap.xml
    const categories = categoryTagsInfo.categories;
    categories.map((category) => {
        sitemapGroup['category'].urlset.url.push({
            loc: category.permalink.toString(),
            // set latest post updated from this tag
            lastmod: moment(category.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    const destCategorySitemap = path.join(hexo.public_dir, 'category-sitemap.xml');
    writefile(destCategorySitemap, create(sitemapGroup['category']).end({ prettyPrint: true }));
    _log.info('category sitemap saved', destCategorySitemap);
    // push category-sitemap.xml to sitemapindex
    const latestCategoryDate = getLatestFromArrayDates(categories.map((category) => {
        return category.latest;
    }));
    _log.info('latest updated category', String(latestCategoryDate));
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/category-sitemap.xml',
        lastmod: moment(latestCategoryDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    const destIndexSitemap = path.join(hexo.public_dir, 'sitemap.xml');
    writefile(destIndexSitemap, create(sitemapIndex).end({ prettyPrint: true }));
    _log.info('index sitemap saved', destIndexSitemap);
}

export { getPageData, yoastSeo, yoastSeoSitemap, yoastSitemapIndex };
