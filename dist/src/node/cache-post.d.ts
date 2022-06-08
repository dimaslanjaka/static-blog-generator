import { postMap } from '../parser/post/parsePost';
import { mergedPostMap } from '../parser/post/postMapper';
export declare type postResult = Partial<mergedPostMap>;
export declare class CachePost {
    constructor();
    set(key: string, value: any): this;
    get<T>(key: string): T;
    getKeys(): string[];
    getAll(): postMap[];
    /**
     * get total posts
     * @returns
     */
    getTotal(): number;
}
/**
 * order array
 * @param array
 * @param by
 * @returns
 */
export declare function orderPostBy<T extends postMap>(array: T[], by: 'updated' | 'date' | '-updated' | '-date' | string): T[];
/**
 * get latest posts
 * @param by order descending by `date` or default (`index_generator.order_by` in `_config.yml`)
 * @param max max result
 * @returns array of {@link postResult}
 */
export declare function getLatestPosts(by?: 'date' | 'updated' | '-date' | '-updated' | string, max?: number): postResult[];
/**
 * get sorted all posts
 * * sort options {@link config.index_generator.order_by}
 * @returns sorted array of posts {@link CachePost.getAll}
 */
export declare function getAllPosts(): postMap[];
/**
 * get total posts (no page)
 * @returns
 */
export declare function getTotalPosts(): number;
/**
 * get random posts
 * @param max max results
 * @param identifier cached result
 * @returns
 */
export declare function getRandomPosts(max?: number, identifier?: string): Partial<mergedPostMap>[];
export declare const Post: typeof CachePost;
