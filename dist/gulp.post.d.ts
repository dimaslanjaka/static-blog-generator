/// <reference types="node" />
import gulp from 'gulp';
export declare function watchPost(done: gulp.TaskFunctionCallback): void;
export declare const copySinglePost: (identifier: string, callback?: ((...args: any[]) => any) | undefined) => void;
export declare function updatePost(): import("stream").Transform;
export declare function copyAllPosts(): any;
