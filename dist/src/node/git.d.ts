/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptions } from 'child_process';
/**
 * git command
 * @param args
 * @returns
 */
export declare function git(options?: null | SpawnOptions, ...args: string[]): Promise<{
    code: number;
    stdout: string[] | import("stream").Readable;
    stderr: any;
}>;
/**
 * get latest commit hash
 * * git log --pretty=tformat:%H -n 1 path
 * * git log --pretty=tformat:%h -n 1 path
 * * git rev-parse HEAD
 * * git rev-parse --short HEAD
 * @param path specific folder
 * @returns
 */
export declare const getLatestCommitHash: (path?: string, short?: boolean) => Promise<any>;
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
