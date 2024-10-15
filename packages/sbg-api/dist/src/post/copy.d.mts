import * as hexoPostParser from 'hexo-post-parser';
import { getConfig } from 'sbg-utility';
/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
/**
 * copy all posts from src-posts to source/_posts
 * @returns
 */
export declare function copyAllPosts(config?: ReturnType<typeof getConfig>): Promise<void>;
/**
 * process single markdown post
 * @param file file path or contents
 * @param callback
 * @returns
 */
export declare function processSinglePost(options: {
    file: string;
    content?: string | null;
}, callback?: (parsed: hexoPostParser.postMap) => any): Promise<string | undefined>;
