import git from 'git-command-helper';
type importConfig = typeof import('./_config.json');
export interface ProjConf extends importConfig {
    [key: string]: any;
    /**
     * Source posts
     */
    post_dir: string;
}
declare const ProjectConfig: ProjConf;
export default ProjectConfig;
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
export declare const commonIgnore: string[];
