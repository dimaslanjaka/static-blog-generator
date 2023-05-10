import * as siteMap from './sitemap';
export { sitemapCrawler, sitemapCrawlerAsync, SiteMapCrawlerCore as SiteMapCrawler } from './sitemap';
declare const _default: (link: string | string[], opts?: siteMap.Opt | undefined, callback?: ((arg0: Error | null, arg1?: string[] | undefined) => void) | undefined) => void;
export default _default;
