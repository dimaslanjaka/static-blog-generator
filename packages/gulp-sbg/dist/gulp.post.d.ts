/// <reference types="node" />
/// <reference types="node" />
import { TaskCallback } from 'undertaker';
export declare function watchPost(done: TaskCallback): void;
export declare const copySinglePost: (identifier: string, callback?: CallableFunction) => void;
/**
 * copy function
 * @param bind bind update date modified on process exit
 * @returns
 */
export declare function copyPost(bind?: boolean): import("stream").Transform;
export declare function copyAllPosts(): NodeJS.ReadWriteStream;
