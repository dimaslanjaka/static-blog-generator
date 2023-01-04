/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
export declare function updatePost(): import("stream").Transform;
export declare function copyAllPosts(): import("fs").WriteStream | NodeJS.ReadWriteStream;
