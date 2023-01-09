/// <reference types="node" />
/// <reference types="node" />
export declare function escapeRegex(string: string, method?: '1' | '2'): string | undefined;
export declare function capitalizer(str: string, moreSymbols?: ConcatArray<string>): string;
export declare function streamToString(stream: NodeJS.ReadableStream): Promise<unknown>;
export declare function bufferToString(array: Buffer): string;
export declare function replacePath(source: string, toReplace: string, replacement?: string): Promise<string>;
