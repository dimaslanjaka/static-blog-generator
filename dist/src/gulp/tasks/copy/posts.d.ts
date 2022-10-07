import { TaskCallback } from 'undertaker';
import { SBGParsePostOptions } from '../../../parser/post/parsePost';
/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param customPaths custom copy, only copy post with this key
 * @returns
 */
export declare function copyPosts(done?: TaskCallback, customPaths?: string | string[], options?: SBGParsePostOptions): import("bluebird")<{
    parse: import("hexo-post-parser/dist/types/postMap").postMap;
    file: string;
    saveTo: string;
}[]>;
/**
 * @see {@link copyPosts}
 */
export declare const copy_posts: typeof copyPosts;
