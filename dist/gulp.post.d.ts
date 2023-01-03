/// <reference types="node" />
import gulp from 'gulp';
export declare function watchPost(done: gulp.TaskFunctionCallback): void;
export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
export declare function updatePost(): import("stream").Transform;
export declare function copyAllPosts(): any;
