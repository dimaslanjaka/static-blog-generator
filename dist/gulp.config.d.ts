import git from 'git-command-helper';
type importConfig = typeof import('./_config.json') & Record<string, any>;
export interface ProjConf extends importConfig {
    [key: string]: any;
    post_dir: string;
    cwd: string;
}
export declare const deployDir: string;
export declare function deployConfig(): {
    deployDir: string;
    config: {
        type: string;
        repo: string;
        branch: string;
        message: string;
        hostname: string;
        username: string;
        email: string;
    };
    github: git;
};
export declare function setConfig(obj: Record<string, any> | ProjConf): ProjConf;
export declare function getConfig(): ProjConf;
export declare const commonIgnore: string[];
export {};
