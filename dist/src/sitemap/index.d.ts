import Hexo from 'hexo';
import hexoIs from 'hexo-is';
import 'nodejs-package-types';
type PageData = Hexo.PageData;
type TemplateLocals = Hexo.TemplateLocals;
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
export declare function getPageData(data: TemplateLocals): returnPageData | undefined;
export declare function yoastSeoSitemap(data: TemplateLocals): void;
export declare function yoastSeo(hexo: Hexo): void;
export declare function yoastSitemapIndex(hexo: Hexo): void;
export {};
