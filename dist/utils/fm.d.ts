/// <reference types="node" />
import { MakeDirectoryOptions } from 'fs';
export interface writefileOpt extends MakeDirectoryOptions {
    append?: boolean;
}
/**
 * write to file recursively
 * @param file
 * @param content
 * @param opt
 */
export declare function writefile(file: string, content: string, opt?: writefileOpt): void;
