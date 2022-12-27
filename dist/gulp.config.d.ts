import git from 'git-command-helper';
import HexoConfig from 'hexo/HexoConfig';
export type importConfig = typeof import('./_config.json');
export interface ProjConf extends HexoConfig {
    [key: string]: any;
    post_dir: string;
    cwd: string;
    deploy: importConfig['deploy'] & ReturnType<typeof deployConfig>;
    external_link: importConfig['external_link'] & boolean & {
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
