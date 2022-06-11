import '../a-core';
export declare const default_config: Partial<SBGConfig>;
export interface Generator {
    cache?: boolean;
    type?: 'hexo' | 'jekyll' | 'sbg';
}
export interface SBGConfig {
    [key: string]: any;
    /**
     * Site title
     */
    title: string;
    generator: Generator;
}
export default default_config;
