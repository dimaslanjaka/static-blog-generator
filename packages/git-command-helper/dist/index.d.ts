import git, { setupGit } from './git';
import { getGithubBranches, getGithubCurrentBranch, getGithubRemote, getGithubRepoUrl, getGithubRootDir } from './git-info';
import { spawnAsync } from './spawn';
import { default as gitSubmodule } from './submodule';
export { SpawnOptions } from './spawn';
export declare const ext: {
    spawn: typeof import("./spawn").default;
    spawnAsync: typeof spawnAsync;
    spawnSilent: (command: string, args?: import("./spawn").SpawnOptions | string[], options?: import("./spawn").SpawnOptions) => Promise<string | void>;
    gitCommandHelper: typeof git;
    gitHelper: typeof git;
    setupGit: typeof setupGit;
    GithubInfo: {
        getGithubCurrentBranch: typeof getGithubCurrentBranch;
        getGithubRemote: typeof getGithubRemote;
        getGithubRepoUrl: typeof getGithubRepoUrl;
        getGithubRootDir: typeof getGithubRootDir;
        getGithubBranches: typeof getGithubBranches;
    };
    getGithubBranches: typeof getGithubBranches;
    getGithubCurrentBranch: typeof getGithubCurrentBranch;
    getGithubRemote: typeof getGithubRemote;
    getGithubRepoUrl: typeof getGithubRepoUrl;
    getGithubRootDir: typeof getGithubRootDir;
    gitSubmodule: typeof gitSubmodule;
};
export default git;
