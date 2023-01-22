/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */
/// <reference types="node" />
import Bluebird from 'bluebird';
import helper from './helper';
import noop from './noop';
import { shell } from './shell';
import { SpawnOptions } from './spawn';
import submodule from './submodule';
import { StatusResult } from './types';
export interface GitOpt {
    user?: string;
    email?: string;
    url: string;
    branch: string;
    baseDir: string;
}
/**
 * Setup git with branch and remote url resolved automatically
 * @param param0
 * @returns
 */
export declare function setupGit({ branch, url, baseDir, email, user }: GitOpt): Promise<git>;
/**
 * GitHub Command Helper For NodeJS
 */
export declare class git {
    submodule: submodule;
    user: string;
    email: string;
    remote: string;
    branch: string;
    private exist;
    cwd: string;
    latestCommit: (path?: string, options?: Partial<import("./latestCommit").GetLatestCommitHashOptions>) => Promise<string>;
    static shell: typeof shell;
    helper: typeof helper;
    static helper: typeof helper;
    static noop: typeof noop;
    infos: {
        getGithubCurrentBranch: typeof import("./git-info").getGithubCurrentBranch;
        getGithubRemote: typeof import("./git-info").getGithubRemote;
        getGithubRepoUrl: typeof import("./git-info").getGithubRepoUrl;
        getGithubRootDir: typeof import("./git-info").getGithubRootDir;
        getGithubBranches: typeof import("./git-info").getGithubBranches;
    };
    getGithubBranches: typeof import("./git-info").getGithubBranches;
    getGithubCurrentBranch: typeof import("./git-info").getGithubCurrentBranch;
    getGithubRemote: typeof import("./git-info").getGithubRemote;
    getGithubRootDir: typeof import("./git-info").getGithubRootDir;
    getGithubRepoUrl: typeof import("./git-info").getGithubRepoUrl;
    constructor(dir: string);
    info(): Promise<{
        opt: SpawnOptions;
        remote: {
            fetch: {
                origin: string;
                url: string;
            };
            push: {
                origin: string;
                url: string;
            };
        };
        branch: {
            active: boolean;
            branch: string;
        }[];
        status: StatusResult[];
    }>;
    /**
     * git config --global --add safe.directory PATH_FOLDER
     */
    addSafe(): Promise<string | void>;
    /**
     * call spawn async
     * @param cmd
     * @param args
     * @param spawnOpt
     * @returns
     */
    spawn(cmd: string, args: string[], spawnOpt: SpawnOptions): Bluebird<string>;
    /**
     * setup merge on pull strategy
     * @returns
     */
    setAutoRebase(): Bluebird<string>;
    /**
     * setup end of line LF
     * @link https://stackoverflow.com/a/13154031
     * @returns
     */
    setForceLF(): Bluebird<string>;
    /**
     * git fetch
     * @param arg argument git-fetch, ex ['--all']
     * @param optionSpawn
     * @returns
     */
    fetch(arg?: string[], optionSpawn?: SpawnOptions): Bluebird<string>;
    /**
     * git pull
     * @param arg example: `['--recurse-submodule']`
     * @param optionSpawn
     * @returns
     */
    pull(arg?: string[], optionSpawn?: SpawnOptions): Promise<string>;
    /**
     * git pull accept merge from remote (accept all incoming changes)
     * @see https://stackoverflow.com/a/21777677
     * @see https://www.folkstalk.com/tech/git-accept-incoming-changes-for-all-with-code-examples/
     */
    pullAcceptTheirs(optionSpawn?: SpawnOptions): Promise<void>;
    /**
     * git commit
     * @param mode -am, -m, etc
     * @param msg commit messages
     * @param optionSpawn
     * @returns
     */
    commit(msg: string, mode?: 'am' | 'm' | string, optionSpawn?: SpawnOptions): Bluebird<string>;
    /**
     * add and commit file
     * @param path
     * @param msg
     * @param mode am/m
     * @returns
     */
    addAndCommit(path: string, msg: string, mode?: string): Bluebird<unknown>;
    /**
     * bulk add and commit
     * @param options array of `path` and `msg` commit message
     * @returns
     */
    commits(options: {
        path: string;
        msg?: string;
        [key: string]: any;
    }[]): Bluebird<Error[]>;
    /**
     * git push
     * @param force
     * @param optionSpawn
     * @returns
     */
    push(force?: boolean, optionSpawn?: SpawnOptions): any;
    /**
     * check if can be pushed
     * @param originName origin name
     */
    canPush(originName?: string, branchName?: string): Promise<boolean>;
    /**
     * Spawn option default stdio pipe
     * @param opt
     * @returns
     */
    private spawnOpt;
    /**
     * git add
     * @param path specific path or argument -A
     * @param optionSpawn
     * @returns
     */
    add(path: string, optionSpawn?: SpawnOptions): Bluebird<string>;
    /**
     * git checkout
     * @param branchName
     * @param optionSpawn
     * @returns
     */
    checkout(branchName: string, optionSpawn?: SpawnOptions): Promise<string>;
    /**
     * get current branch informations
     * @returns
     */
    getbranch(): Promise<{
        active: boolean;
        branch: string;
    }[]>;
    /**
     * Check if current repository is up to date with origin/remote
     * @returns
     */
    isUpToDate(): Bluebird<boolean>;
    /**
     * git status
     * @returns
     */
    status(): Bluebird<StatusResult[]>;
    /**
     * git init
     * @returns
     */
    init(spawnOpt?: SpawnOptions): Promise<string | void>;
    /**
     * Check if git folder exists
     * @returns
     */
    isExist(): Bluebird<boolean>;
    setcwd(v: string): void;
    setemail(v: string): Bluebird<string>;
    setuser(v: string): Bluebird<string>;
    /**
     * set remote url
     * @param v
     * @param name custom object name
     * @returns
     * @example
     * // default
     * git add remote origin https://
     * // custom name
     * git add remote customName https://
     */
    setremote(v: string | URL, name?: string, spawnOpt?: SpawnOptions): Promise<any>;
    /**
     * get remote information
     * @param args
     * @returns
     */
    getremote(args?: string[]): Promise<{
        fetch: {
            origin: string;
            url: string;
        };
        push: {
            origin: string;
            url: string;
        };
    }>;
    checkLock(): boolean;
    /**
     * set branch (git checkout branchName)
     * @param branchName
     * @returns
     */
    setbranch(branchName: string, force?: boolean, spawnOpt?: SpawnOptions): Promise<string | void>;
    /**
     * Reset to latest commit of remote branch
     * @param branch
     */
    reset(branch?: string): Bluebird<string>;
}
export default git;
export declare const gitHelper: typeof git;
export declare const gitCommandHelper: typeof git;
