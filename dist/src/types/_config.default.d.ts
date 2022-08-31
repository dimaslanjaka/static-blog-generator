import '../a-core';
export declare const default_config: Partial<SBGConfig>;
export interface Generator {
    [key: string]: any;
    copy?: GeneratorCopy;
    cache?: boolean;
    type?: 'hexo' | 'jekyll' | 'sbg';
}
export interface GeneratorCopy {
    [key: string]: any;
    space?: boolean;
}
export interface SBGConfig {
    [key: string]: any;
    /**
     * Site title
     */
    title: string;
    generator: Generator;
    deploy: SBGDeploy;
}
export interface SBGDeploy {
    [key: string]: any;
    type: string;
    repo: string;
    branch: string;
    name: string;
    email: string;
}
export default default_config;
