/// <reference types="node" />
/// <reference types="node" />
import PersistentCache from 'persistent-cache';
import { TaskCallback } from 'undertaker';
/**
 * Watch post while you writing new or modify posts from src-posts folder
 * @param done
 */
export declare function watchPost(done: TaskCallback): void;
/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
export declare const copySinglePost: (identifier: string, callback?: CallableFunction) => void;
/**
 * copy watched post
 * @returns
 */
export declare function updatePost(): import("stream").Transform;
export declare function copyAllPosts(): NodeJS.ReadWriteStream;
/**
 *
 * @param options
 * @returns
 */
export declare function gulpCached(options?: Parameters<typeof PersistentCache>[0]): import("stream").Transform;
export declare function gulpDebug(): import("stream").Transform;
