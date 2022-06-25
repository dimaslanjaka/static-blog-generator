/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptions } from 'child_process';
/**
 * git command
 * @param options git argument or spawn options
 * @param args git variadic arguments
 * @returns
 */
export declare function git(options?: null | string | SpawnOptions, ...args: string[]): Promise<{
    code: number;
    stdout: string[] | import("stream").Readable;
    stderr: any;
}>;
declare type GetLatestCommitHashOptions = Partial<SpawnOptions> & {
    short: boolean;
};
/**
 * get latest commit hash
 * * git log --pretty=tformat:%H -n 1 path
 * * git log --pretty=tformat:%h -n 1 path
 * * git rev-parse HEAD
 * * git rev-parse --short HEAD
 * @param path specific folder
 * @returns
 */
export declare const getLatestCommitHash: (path?: string, options?: Partial<GetLatestCommitHashOptions>) => Promise<string>;
/**
 * git describe
 * @returns
 */
export declare const gitDescribe: () => Promise<any>;
export declare function gitAddAndCommit(file: string, msg: string, options?: null | SpawnOptions): Promise<{
    code: number;
    stdout: string[] | import("stream").Readable;
    stderr: any;
}>;
export default git;
