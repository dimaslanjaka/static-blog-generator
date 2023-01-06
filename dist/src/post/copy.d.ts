/// <reference types="node" />
import { getConfig } from '../gulp.config';
export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
export declare function copyAllPosts(callback?: ((...args: any[]) => any) | null | undefined): any;
export declare function processPost(config: ReturnType<typeof getConfig>): import("stream").Transform;
