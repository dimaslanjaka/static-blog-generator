import fs, { MakeDirectoryOptions } from 'fs-extra';
export interface writefileOpt extends MakeDirectoryOptions {
    append?: boolean | undefined | null;
    async?: boolean | undefined | null;
}
export interface writefileResult {
    file: string;
    append: boolean;
}
export declare function writefile(file: string, content: string): writefileResult;
export declare function writefile(file: string, content: string, opt: {
    append: boolean;
    async: undefined | null;
}): writefileResult;
export declare function writefile(file: string, content: string, opt: {
    async: true;
}): Promise<writefileResult>;
export declare function writefile(file: string, content: string, opt: {
    async: true;
    append: boolean | undefined | null;
}): Promise<writefileResult>;
export declare function writefile(file: string, content: string, opt: {
    async?: false | undefined | null;
    append?: boolean;
}): writefileResult;
export declare function createWriteStream(dest: string, options?: Parameters<typeof fs['createWriteStream']>[1]): any;
export declare const isAsset: (path: any) => boolean;
export declare const isMarkdown: (path: any) => boolean;
