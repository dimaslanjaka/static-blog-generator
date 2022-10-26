/// <reference types="node" />
/// <reference types="node" />
import { TaskCallback } from 'undertaker';
export declare function watchPost(done: TaskCallback): void;
export declare const copySinglePost: (identifier: string, callback?: CallableFunction) => void;
export declare function copyPost(): import("stream").Transform;
export declare function copyAllPosts(): NodeJS.ReadWriteStream;
