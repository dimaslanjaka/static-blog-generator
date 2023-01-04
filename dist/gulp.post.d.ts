export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
export declare function updatePost(postPath: string, callback?: (result: boolean, postPath: string) => any): Promise<boolean>;
export declare function copyAllPosts(): import("fs").WriteStream | NodeJS.ReadWriteStream;
