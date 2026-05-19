import * as siteMap from './sitemap-crawler.js';

//module 'sitemap-crawler'

export * from './sitemap-crawler.js';
export { SiteMapCrawlerCore as SiteMapCrawler, sitemapCrawler, sitemapCrawlerAsync } from './sitemap-crawler.js';
export default siteMap.sitemapCrawler;
