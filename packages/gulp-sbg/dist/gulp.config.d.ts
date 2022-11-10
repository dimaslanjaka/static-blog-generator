declare type importConfig = typeof import('./_config.json');
export interface ProjConf extends importConfig {
    [key: string]: any;
}
declare const ProjectConfig: ProjConf;
export default ProjectConfig;
export declare function deployConfig(): {
    deployDir: string;
    config: ProjConf;
    github: import("git-command-helper").default;
};
export declare const commonIgnore: string[];
