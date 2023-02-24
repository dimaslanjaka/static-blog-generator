import * as siteMap from './sitemap-crawler';
export * from './sitemap-crawler';
export { sitemapCrawler, sitemapCrawlerAsync, SiteMapCrawlerCore as SiteMapCrawler } from './sitemap-crawler';
declare const _default: (link: string | string[], opts?: siteMap.Opt, callback?: (arg0: Error, arg1?: string[]) => void) => void;
export default _default;
