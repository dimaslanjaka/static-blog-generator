import { TaskCallback } from 'undertaker';
import { parsePost } from '../../../parser/post/parsePost';
import './assets';
/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param customPaths custom copy, only copy post with this key
 * @returns
 */
export declare const copyPosts: (_done?: TaskCallback, customPaths?: string | string[], _options?: Partial<Parameters<typeof parsePost>[2]>) => import("bluebird")<{
    parse: import("hexo-post-parser/dist/types/postMap").postMap;
    file: string;
}[]>;
/**
 * @see {@link copyPosts}
 */
export declare const copy_posts: (_done?: TaskCallback, customPaths?: string | string[], _options?: Partial<Parameters<typeof parsePost>[2]>) => import("bluebird")<{
    parse: import("hexo-post-parser/dist/types/postMap").postMap;
    file: string;
}[]>;
