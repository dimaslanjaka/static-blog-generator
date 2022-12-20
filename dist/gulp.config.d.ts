import git from 'git-command-helper';
type importConfig = typeof import('./_config.json') & Record<string, any>;
export interface ProjConf extends importConfig {
    [key: string]: any;
    /**
     * Source posts
     */
    post_dir: string;
    /**
     * Project CWD
     */
    cwd: string;
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
/**
 * Config setter
 * * useful for jest
 * @param obj
 */
export declare function setConfig(obj: Record<string, any> | ProjConf): ProjConf;
/**
 * Config getter
 * * useful for jest
 * @returns
 */
export declare function getConfig(): ProjConf;
/**
 * common ignore files
 * @example
 * const config = getConfig();
 * const excludes = Array.isArray(config.exclude) ? config.exclude : [];
 * excludes.push(...commonIgnore);
 */
export declare const commonIgnore: string[];
