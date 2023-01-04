/// <reference types="node" />
/// <reference types="node" />
export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
export declare function updatePost(postPath: string): Promise<void>;
export declare function copyAllPosts(): import("fs").WriteStream | NodeJS.ReadWriteStream;
