/// <reference types="node" />
import Bluebird from 'bluebird';
import fs from 'fs-extra';
export interface writefileOpt extends fs.MakeDirectoryOptions {
    append?: boolean | undefined | null;
    async?: boolean | undefined | null;
}
export interface writefileResult {
    file: string;
    append: boolean;
}
export type strORobj = string | Record<string, any>;
/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 */
export declare function writefile(file: string, content: strORobj): writefileResult;
export declare function writefile(file: string, content: strORobj, opt: {
    append: boolean;
    async: undefined | null;
}): writefileResult;
/**
 * async write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export declare function writefile(file: string, content: strORobj, opt: {
    async: true;
}): Promise<writefileResult>;
export declare function writefile(file: string, content: strORobj, opt: {
    async: true;
    append: boolean | undefined | null;
}): Promise<writefileResult>;
/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export declare function writefile(file: string, content: strORobj, opt: {
    async?: false | undefined | null;
    append?: boolean;
}): writefileResult;
/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
export declare function createWriteStream(dest: string, options?: Parameters<(typeof fs)['createWriteStream']>[1]): fs.WriteStream;
/**
 * is non-markdown file
 * @param path
 * @returns
 */
export declare const isAsset: (path: any) => boolean;
/**
 * is markdown file
 * @param path
 * @returns
 */
export declare const isMarkdown: (path: any) => boolean;
/**
 * delete folder async
 * @param path
 * @returns
 */
export declare function del(path: string): Bluebird<unknown>;
