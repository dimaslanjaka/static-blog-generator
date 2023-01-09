/// <reference types="node" />
/// <reference types="node" />
import { getConfig } from '../_config';
export declare function copySinglePost(identifier: string, callback?: (...args: any[]) => any): void;
export declare function copyAllPosts(): NodeJS.ReadWriteStream;
export declare function pipeProcessPost(config: ReturnType<typeof getConfig>): import("stream").Transform;
export declare function processSinglePost(file: string): Promise<string | undefined>;
