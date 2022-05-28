/// <reference types="node" />
import { TaskCallback } from 'undertaker';
import './copy/assets';
/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param cpath custom copy, only copy post with this key
 * @returns
 */
export declare const copyPosts: (_done?: TaskCallback, cpath?: string) => NodeJS.ReadWriteStream;
/**
 * @see {@link copyPosts}
 */
export declare const copy_posts: (_done?: TaskCallback, cpath?: string) => NodeJS.ReadWriteStream;
