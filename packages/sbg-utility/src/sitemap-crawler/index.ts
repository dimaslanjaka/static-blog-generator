import * as siteMap from './sitemap-crawler';

//module 'sitemap-crawler'

export * from './sitemap-crawler';
export { SiteMapCrawlerCore as SiteMapCrawler, sitemapCrawler, sitemapCrawlerAsync } from './sitemap-crawler';
export default siteMap.sitemapCrawler;
