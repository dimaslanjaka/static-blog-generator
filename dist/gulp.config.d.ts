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
    tags: LabelMapper;
    categories: LabelMapper;
}
export interface LabelMapper {
    lowercase: boolean;
    assign: Record<string, string> | undefined;
    mapper: Record<string, string> | undefined;
}
export declare function setConfig(obj: Record<string, any> | ProjConf): ProjConf;
export declare function getConfig(get?: boolean): ProjConf;
export declare function deployConfig(): {
    deployDir: string;
    github: git | null;
};
export declare const commonIgnore: string[];
