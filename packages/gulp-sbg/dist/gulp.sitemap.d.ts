import Bluebird from 'bluebird';
/**
 * Sitemap Generator
 * @param url url to crawl
 * @param deep crawl deeper n times
 * @returns
 */
export declare function generateSitemap(url?: string | null | undefined, deep?: number): Bluebird<string[]>;
