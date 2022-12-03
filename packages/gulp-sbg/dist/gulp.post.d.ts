/// <reference types="node" />
/// <reference types="node" />
import gulp from 'gulp';
/**
 * Watch post while you writing new or modify posts from src-posts folder
 * @param done
 */
export declare function watchPost(done: gulp.TaskFunctionCallback): void;
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
/**
 * copy all posts from src-posts to source/_posts
 * @returns
 */
export declare function copyAllPosts(): NodeJS.ReadWriteStream;
