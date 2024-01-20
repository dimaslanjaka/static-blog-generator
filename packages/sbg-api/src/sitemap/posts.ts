import Bluebird from 'bluebird';
import Hexo from 'hexo';
import moment from 'moment-timezone';
import { join } from 'path';
import { writefile } from 'sbg-utility';
import { create as createXML } from 'xmlbuilder2';
import { sitemapItem } from './yoast-sitemap';

const postUpdateDates: string[] = [];
const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const sitemapPostsList: sitemapItem[] = [];

/**
 * build post-sitemap.xml
 * @param hexo
 */
export default async function yoastSeoSitemapPosts(hexo: Hexo) {
  const postArray = hexo.locals.get('posts').toArray() as Record<string, any>[];
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

  const destSitemap = join(hexo.public_dir, 'post-sitemap.xml');
  writefile(
    destSitemap,
    createXML({
      urlset: {
        url: sitemapPostsList
      }
    }).end({ prettyPrint: true })
  );
  _log.info('post sitemap saved', destSitemap);
}

/**
 * get all post updated dates
 * @returns
 */
export function getAllpostUpdateDates() {
  return postUpdateDates;
}
