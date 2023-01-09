import Bluebird from 'bluebird';
export declare function generateSitemap(url?: string | null | undefined, deep?: number): Bluebird<string[]>;
export interface SitemapOptions {
    path: string[];
    tags: boolean;
    categories: boolean;
    rel: boolean;
    yoast: boolean;
}
export declare function hexoGenerateSitemap(): Bluebird<unknown>;
