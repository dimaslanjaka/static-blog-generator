import Bluebird from 'bluebird';
declare type cb = (arg0: Error | null, arg1?: any) => void;
export declare class SiteMapCrawlerCore {
    static start(links: string[], isProgress: any, isLog: any, isCounting: boolean, callback: cb): void;
    static filterLink(parent: string, href: string): string | null;
}
export interface Opt {
    isProgress: boolean;
    isLog: boolean;
}
export declare const sitemapCrawler: (link: string | string[], opts?: Opt, callback?: cb) => void;
export interface SitemapAsyncOpt extends Opt {
    deep?: boolean;
}
export declare function sitemapCrawlerAsync(link: string | string[], opts?: SitemapAsyncOpt): Bluebird<unknown>;
export default sitemapCrawler;
