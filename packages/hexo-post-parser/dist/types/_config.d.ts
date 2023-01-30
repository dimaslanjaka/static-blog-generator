import HexoConfig from 'hexo/HexoConfig';
declare const nocache: any;
declare const verbose: any;
declare const defaultSiteOptions: {
    title: string;
    subtitle: string;
    description: string;
    author: string;
    language: string;
    timezone: string;
    url: string;
    root: string;
    permalink: string;
    permalink_defaults: {};
    pretty_urls: {
        trailing_index: boolean;
        trailing_html: boolean;
    };
    source_dir: string;
    public_dir: string;
    tag_dir: string;
    archive_dir: string;
    category_dir: string;
    code_dir: string;
    i18n_dir: string;
    skip_render: any[];
    new_post_name: string;
    default_layout: string;
    titlecase: boolean;
    external_link: {
        enable: boolean;
        field: string;
        exclude: string;
    };
    filename_case: number;
    render_drafts: boolean;
    post_asset_folder: boolean;
    relative_link: boolean;
    future: boolean;
    syntax_highlighter: string;
    highlight: {
        auto_detect: boolean;
        line_number: boolean;
        tab_replace: string;
        wrap: boolean;
        exclude_languages: any[];
        language_attr: boolean;
        hljs: boolean;
    };
    prismjs: {
        preprocess: boolean;
        line_number: boolean;
        tab_replace: string;
    };
    default_category: string;
    category_map: {};
    tag_map: {};
    date_format: string;
    time_format: string;
    updated_option: string;
    per_page: number;
    pagination_dir: string;
    theme: string;
    server: {
        cache: boolean;
    };
    deploy: {};
    ignore: any[];
    meta_generator: boolean;
    generator: {
        cache: boolean;
        type: string;
        verbose: boolean;
        amp: boolean;
    };
    post_dir: string;
};
export type SiteConfig = typeof defaultSiteOptions & Record<string, any>;
/**
 * get site _config.yml
 * @returns
 */
export declare function getConfig(): SiteConfig;
/**
 * assign new option
 * @param obj
 * @returns
 */
export declare function setConfig(obj: Record<string, any>): SiteConfig;
export { verbose, nocache };
export interface ProjectConfig extends HexoConfig {
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
/**
 * Hexo Generated Dir
 */
export declare const post_generated_dir: string;
/**
 * SBG Source Post Dir
 */
export declare const post_source_dir: string;
