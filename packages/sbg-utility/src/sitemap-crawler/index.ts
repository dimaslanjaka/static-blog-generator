import * as siteMap from './sitemap-crawler';

//module 'sitemap-crawler'

export * from './sitemap-crawler';
export {
  sitemapCrawler,
  sitemapCrawlerAsync,
  SiteMapCrawlerCore as SiteMapCrawler
} from './sitemap-crawler';
export default siteMap.sitemapCrawler;
