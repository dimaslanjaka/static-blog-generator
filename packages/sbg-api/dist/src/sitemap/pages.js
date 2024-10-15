import Bluebird from 'bluebird';
import moment from 'moment-timezone';
import { writefile } from 'sbg-utility';
import path from 'upath';
import { create } from 'xmlbuilder2';

const pageUpdateDates = [];
const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const sitemapPagesList = [];
/**
 * build page-sitemap.xml
 * @param hexo
 */
async function yoastSeoSitemapPages(hexo) {
    const postArray = hexo.locals.get('posts').toArray();
    await Bluebird.all(postArray).each(function (data) {
        const lastmod = data.updated?.format('YYYY-MM-DDTHH:mm:ssZ') || moment().format();
        pageUpdateDates.push(lastmod);
        const info = {
            loc: data.permalink,
            lastmod,
            changefreq: 'weekly',
            priority: '0.8'
        };
        sitemapPagesList.push(info);
    });
    const destSitemap = path.join(hexo.public_dir, 'page-sitemap.xml');
    writefile(destSitemap, create({
        urlset: {
            url: sitemapPagesList
        }
    }).end({ prettyPrint: true }));
    _log.info('page sitemap saved', destSitemap);
}
/**
 * get all page updated dates
 * @returns
 */
function getAllpageUpdateDates() {
    return pageUpdateDates;
}

export { yoastSeoSitemapPages as default, getAllpageUpdateDates };
