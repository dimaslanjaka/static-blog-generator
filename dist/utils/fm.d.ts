/// <reference types="node" />
import Bluebird from 'bluebird';
import fs, { MakeDirectoryOptions } from 'fs-extra';
export interface writefileOpt extends MakeDirectoryOptions {
    append?: boolean | undefined | null;
    async?: boolean | undefined | null;
}
export interface writefileResult {
    file: string;
    append: boolean;
}
export type strORobj = string | Record<string, any>;
export declare function writefile(file: string, content: strORobj): writefileResult;
export declare function writefile(file: string, content: strORobj, opt: {
    append: boolean;
    async: undefined | null;
}): writefileResult;
export declare function writefile(file: string, content: strORobj, opt: {
    async: true;
}): Promise<writefileResult>;
export declare function writefile(file: string, content: strORobj, opt: {
    async: true;
    append: boolean | undefined | null;
}): Promise<writefileResult>;
export declare function writefile(file: string, content: strORobj, opt: {
    async?: false | undefined | null;
    append?: boolean;
}): writefileResult;
export declare function createWriteStream(dest: string, options?: Parameters<(typeof fs)['createWriteStream']>[1]): fs.WriteStream;
export declare const isAsset: (path: any) => boolean;
export declare const isMarkdown: (path: any) => boolean;
export declare function del(path: string): Bluebird<unknown>;
