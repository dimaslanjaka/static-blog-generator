/// <reference types="node" />
import fs, { MakeDirectoryOptions } from 'fs-extra';
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
export declare function createWriteStream(dest: string, options?: Parameters<typeof fs['createWriteStream']>[1]): fs.WriteStream;
