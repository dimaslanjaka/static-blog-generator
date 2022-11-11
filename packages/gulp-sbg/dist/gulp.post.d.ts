/// <reference types="node" />
/// <reference types="node" />
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
export declare function gulpDebug(): import("stream").Transform;
