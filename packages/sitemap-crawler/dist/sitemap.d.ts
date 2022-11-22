import Bluebird from 'bluebird';
type cb = (arg0: Error | null, arg1?: string[]) => void;
export interface Opt {
    isProgress?: boolean;
    isLog?: boolean;
    /**
     * keep query url ?key=value
     */
    keepQuery?: boolean;
    /**
     * Crawl internal links [n] times
     * * **WARNING** dont put `Infinite`
     */
    deep?: number | null;
}
export declare class SiteMapCrawlerCore {
    static start(links: string[], core_opt: Opt, isCounting: boolean, callback: cb): void;
    static filterLink(parent: string, href: string): string | null;
}
export declare const sitemapCrawler: (link: string | string[], opts?: Opt, callback?: cb) => void;
export declare function sitemapCrawlerAsync(link: string | string[], opts?: Opt): Bluebird<Record<string, string[]>>;
export default sitemapCrawler;
