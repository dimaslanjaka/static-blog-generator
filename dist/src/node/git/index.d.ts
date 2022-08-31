/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptions } from 'child_process';
/**
 * git command
 * @param optionsOrCmd git argument or spawn options
 * @param args git variadic arguments
 * @returns
 * @example
 * await git('add', '-A');
 * await git('commit', '-m', 'commit messages');
 * await git('push');
 */
export declare function git(optionsOrCmd?: null | string | SpawnOptions, ...args: string[]): Promise<{
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
export interface SubmoduleObject {
    [key: string]: any;
    path: string;
    url: string;
    branch?: string;
    fullpath?: string;
}
export interface SubmoduleResult {
    [key: string]: any;
    hasSubmodule: boolean;
    data: SubmoduleObject[];
}
/**
 * extract submodule to object
 * @param path path to .gitmodules or git directory
 */
export declare function extractSubmodule(path: string): SubmoduleResult;
