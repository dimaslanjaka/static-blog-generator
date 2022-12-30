/// <reference types="node" />
import { MakeDirectoryOptions } from 'fs';
export interface writefileOpt extends MakeDirectoryOptions {
    append?: boolean;
    async?: boolean;
}
export interface writefileResult {
    file: string;
    append: boolean;
}
export declare function writefile(file: string, content: string): writefileResult;
export declare function writefile(file: string, content: string, opt: {
    async?: true;
} & writefileOpt): Promise<writefileResult>;
export declare function writefile(file: string, content: string, opt: {
    async?: false;
} & writefileOpt): writefileResult;
