import { postMap } from '../parser/post/parsePost';
import CacheFile from './cache';
/**
 * all sitemaps
 */
interface SitemapInfo {
    [key: string]: any;
    title?: postMap['metadata']['title'];
    date?: postMap['metadata']['date'];
    updated?: postMap['metadata']['updated'];
    excerpt?: postMap['metadata']['excerpt'];
    thumbnail?: postMap['metadata']['thumbnail'];
    url?: postMap['metadata']['url'];
    views?: number;
}
export default class Sitemap extends CacheFile {
    constructor();
    getValues(opt?: import("./cache").ResovableValue): SitemapInfo[];
    add(obj: SitemapInfo): this;
    getTotal(): number;
}
export {};
