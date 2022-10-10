import Bluebird from 'bluebird';
declare type cb = (arg0: Error | null, arg1?: any) => void;
interface Opt {
    isProgress: boolean;
    isLog: boolean;
}
declare const siteMap: (link: string | string[], opts?: Opt, callback?: cb) => void;
export declare function sitemapAsync(link: string | string[], opts?: Opt): Bluebird<unknown>;
export default siteMap;
