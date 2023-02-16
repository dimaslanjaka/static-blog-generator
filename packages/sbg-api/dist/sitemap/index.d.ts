import Bluebird from 'bluebird';
/**
 * Sitemap Generator
 * @param url url to crawl
 * @param deep crawl deeper n times
 * @returns
 */
export declare function generateSitemap(url?: string | null | undefined, deep?: number): Bluebird<string[]>;
export interface SitemapOptions {
    path: string[];
    tags: boolean;
    categories: boolean;
    rel: boolean;
    yoast: boolean;
}
/**
 * generate sitemap with hexo
 * @param config
 * @returns
 */
export declare function hexoGenerateSitemap(config?: import("sbg-utility").ProjConf): Bluebird<unknown>;
