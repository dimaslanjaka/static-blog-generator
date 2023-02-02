import git from 'git-command-helper';
import Hexo from 'hexo';
import * as defaults from './defaults';
export interface ProjConf extends Hexo.Config {
    [key: string]: any;
    /**
     * Source posts
     */
    post_dir: string;
    /**
     * Project CWD
     */
    cwd: string;
    /**
     * Deployment options
     */
    deploy: defaults.importConfig['deploy'] & ReturnType<typeof deployConfig>;
    external_link: defaults.importConfig['external_link'] & boolean & {
        safelink?: import('safelinkify').SafelinkOptions;
    };
    /**
     * global ignore
     */
    exclude: string[];
    generator: {
        [key: string]: any;
        cache: boolean;
        verbose: boolean;
    };
    /**
     * Tags mapper
     */
    tags?: LabelMapper;
    /**
     * Categories mapper
     */
    categories?: LabelMapper;
}
export interface LabelMapper {
    /**
     * turn label to lower case
     */
    lowercase: boolean;
    /**
     * add old label with new label
     */
    assign: Record<string, string> | undefined | null;
    /**
     * replace old label with new label
     */
    mapper: Record<string, string> | undefined | null;
}
export declare function fetchConfig(fileYML: string): void;
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
export declare function deployConfig(): {
    deployDir: string;
    github: git;
};
/**
 * common ignore files
 * @example
 * const config = getConfig();
 * const excludes = Array.isArray(config.exclude) ? config.exclude : [];
 * excludes.push(...commonIgnore);
 */
export declare const commonIgnore: string[];
/**
 * array of config.exclude, config.ignore
 */
export declare const projectIgnores: string[];
