/// <reference types="node" />
import gulp from 'gulp';
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
export declare function copyAllPosts(_callback?: gulp.TaskFunctionCallback, config?: ReturnType<typeof getConfig>): any;
/**
 * pipeable function to process post
 * @param config
 * @returns
 */
export declare function pipeProcessPost(config: ReturnType<typeof getConfig>): import("stream").Transform;
export declare function processSinglePost(file: string, callback?: (parsed: hexoPostParser.postMap) => any): Promise<string>;
