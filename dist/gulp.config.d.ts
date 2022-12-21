import git from 'git-command-helper';
type importConfig = typeof import('./_config.json') & Record<string, any>;
export interface ProjConf extends importConfig {
    [key: string]: any;
    post_dir: string;
    cwd: string;
    deploy: importConfig['deploy'] & ReturnType<typeof deployConfig>;
    language: importConfig['language'] & string;
    external_link: importConfig['external_link'] & {
        safelink?: import('safelinkify').SafelinkOptions;
    };
}
export declare function setConfig(obj: Record<string, any> | ProjConf): ProjConf;
export declare function getConfig(): ProjConf;
export declare function deployConfig(): {
    deployDir: string;
    github: git;
};
export declare const commonIgnore: string[];
export {};
