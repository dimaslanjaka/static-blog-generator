'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Bluebird = require('bluebird');
var moment = require('moment-timezone');
var sbgUtils = require('sbg-utility');
var path = require('upath');
var xmlbuilder2 = require('xmlbuilder2');

const postUpdateDates = [];
const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const sitemapPostsList = [];
/**
 * build post-sitemap.xml
 * @param hexo
 */
async function yoastSeoSitemapPosts(hexo) {
    const postArray = hexo.locals.get('posts').toArray();
    await Bluebird.all(postArray).each(function (data) {
        const lastmod = data.updated?.format('YYYY-MM-DDTHH:mm:ssZ') || moment().format();
        postUpdateDates.push(lastmod);
        const info = {
            loc: data.permalink,
            lastmod,
            changefreq: 'weekly',
            priority: '0.8'
        };
        sitemapPostsList.push(info);
    });
    const destSitemap = path.join(hexo.public_dir, 'post-sitemap.xml');
    sbgUtils.writefile(destSitemap, xmlbuilder2.create({
        urlset: {
            url: sitemapPostsList
        }
    }).end({ prettyPrint: true }));
    _log.info('post sitemap saved', destSitemap);
}
/**
 * get all post updated dates
 * @returns
 */
function getAllpostUpdateDates() {
    return postUpdateDates;
}

exports.default = yoastSeoSitemapPosts;
exports.getAllpostUpdateDates = getAllpostUpdateDates;
