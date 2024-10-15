import Bluebird from 'bluebird';
import moment from 'moment-timezone';
import { writefile } from 'sbg-utility';
import path from 'upath';
import { create } from 'xmlbuilder2';

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
    writefile(destSitemap, create({
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

export { yoastSeoSitemapPosts as default, getAllpostUpdateDates };
