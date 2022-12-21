/// <reference types="node" />
import { MakeDirectoryOptions } from 'fs';
export interface writefileOpt extends MakeDirectoryOptions {
    append?: boolean;
}
export declare function writefile(file: string, content: string, opt?: writefileOpt): void;
