import git from 'git-command-helper';
import Hexo from 'hexo';
export type importConfig = typeof import('./_config.json');
export interface ProjConf extends Hexo.Config {
    [key: string]: any;
    post_dir: string;
    cwd: string;
    deploy: importConfig['deploy'] & ReturnType<typeof deployConfig>;
    external_link: importConfig['external_link'] & boolean & {
        safelink?: import('safelinkify').SafelinkOptions;
    };
    exclude: string[];
    generator: {
        [key: string]: any;
        cache: boolean;
        verbose: boolean;
    };
    tags?: LabelMapper;
    categories?: LabelMapper;
}
export interface LabelMapper {
    lowercase: boolean;
    assign: Record<string, string> | undefined | null;
    mapper: Record<string, string> | undefined | null;
}
export declare function setConfig(obj: Record<string, any> | ProjConf): ProjConf;
export declare function getConfig(): ProjConf;
export declare function deployConfig(): {
    deployDir: string;
    github: git | null;
};
export declare const commonIgnore: string[];
export declare const projectIgnores: string[];
