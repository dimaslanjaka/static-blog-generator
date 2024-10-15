import Hexo from 'hexo';
import hexoIs from 'hexo-is';
type PageData = Hexo['locals'];
type TemplateLocals = Hexo['locals'];
export interface sitemapItem {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
}
export interface sitemapObj {
    urlset: {
        url: sitemapItem[];
    };
}
export interface returnPageData extends PageData {
    [key: string]: any;
    is: ReturnType<typeof hexoIs>;
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
export declare function getPageData(data: TemplateLocals): returnPageData | undefined;
export declare function yoastSeoSitemap(data: TemplateLocals): void;
/**
 * yoast seo sitemap builder
 * @param hexo
 */
export declare function yoastSeo(hexo: Hexo): void;
/**
 * generate yoast
 * * path /sitemap.xml
 * @param hexo
 */
export declare function yoastSitemapIndex(hexo: Hexo): void;
export {};
