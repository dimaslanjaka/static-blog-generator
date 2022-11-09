import Bluebird from 'bluebird';
/**
 * Sitemap Generator
 * @param url url to crawl
 * @param depth crawl deeper n times
 * @returns
 */
export declare function generateSitemap(url?: string | null | undefined, depth?: number): Bluebird<string[]>;
