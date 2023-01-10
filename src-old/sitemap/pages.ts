import Bluebird from 'bluebird';
import Hexo from 'hexo';
import moment from 'moment-timezone';
import { join } from 'path';
import { create as createXML } from 'xmlbuilder2';
import { sitemapItem } from '.';
import { writefile } from '../utils/fm';

const pageUpdateDates: string[] = [];
const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const sitemapPagesList: sitemapItem[] = [];

/**
 * build page-sitemap.xml
 * @param hexo
 */
export default async function yoastSeoSitemapPages(hexo: Hexo) {
  await Bluebird.all(hexo.locals.get('pages').toArray()).each(function (data) {
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

  const destSitemap = join(hexo.public_dir, 'page-sitemap.xml');
  writefile(
    destSitemap,
    createXML({
      urlset: {
        url: sitemapPagesList
      }
    }).end({ prettyPrint: true })
  );
  _log.info('page sitemap saved', destSitemap);
}

/**
 * get all page updated dates
 * @returns
 */
export function getAllpageUpdateDates() {
  return pageUpdateDates;
}
