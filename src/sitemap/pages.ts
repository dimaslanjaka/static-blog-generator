import Hexo from 'hexo';
import moment from 'moment-timezone';
import { join } from 'path';
import { create as createXML } from 'xmlbuilder2';
import { sitemapItem } from '.';
import { writefile } from '../utils/fm';

const pageUpdateDates: string[] = [];
const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const sitemapPagesList: sitemapItem[] = [];

export default function yoastSeoSitemapPages(hexo: Hexo) {
  hexo.locals.get('pages').forEach(function (data) {
    const lastmod = data.updated?.format('YYYY-MM-DDTHH:mm:ssZ') || moment().format();
    pageUpdateDates.push(lastmod);
    const info = {
      loc: data.permalink,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8'
    };
    sitemapPagesList.push(info);
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
  });
}

export function getAllpageUpdateDates() {
  return pageUpdateDates;
}
