import { postMap } from '../parser/post/parsePost';
import { mergedPostMap } from '../parser/post/postMapper';
export declare type postResult = Partial<mergedPostMap>;
export declare class CachePost {
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
 * get latest posts
 * @param by order descending by `date` or default (`index_generator.order_by` in `_config.yml`)
 * @param max max result
 * @returns array of {@link postResult}
 */
export declare function getLatestPosts(by?: 'date' | 'updated' | '-date' | '-updated', max?: number): postResult[];
/**
 * get all posts
 * @returns array of posts {@link CacheFile.getValues}
 */
export declare function getAllPosts(): any[];
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
export default CachePost;
