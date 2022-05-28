import { initializeApp } from 'firebase/app';
import memoizee from 'memoizee';
import { Ngrok } from 'ngrok';
import project_config_data from './_config_project.json';
/**
 * Argument CLI reader
 */
export declare const argv: {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
} | Promise<{
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
}>;
/**
 * process cwd unix style
 */
declare let root: string;
export declare const cwd: (() => string) & memoizee.Memoized<() => string>;
export { root };
/** default project config */
export declare const default_project_config: {
    verbose: boolean;
    exclude: any[];
    include: any[];
    skip_render: any[];
    ignore: any[];
    adsense: {
        article_ads: any[];
    };
    firebase: {
        apiKey: any;
        authDomain: any;
        projectId: any;
        storageBucket: any;
        messagingSenderId: any;
        appId: any;
        measurementId: any;
    };
    ngrok: {
        token: any;
    };
    generator: {
        cache: boolean;
    };
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
    title_map: {};
    tag_map: {};
    category_map: {};
    tag_group: {};
    category_group: {};
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
    highlight: {
        enable: boolean;
        auto_detect: boolean;
        line_number: boolean;
        tab_replace: string;
        wrap: boolean;
        exclude_languages: any[];
        hljs: boolean;
    };
    prismjs: {
        enable: boolean;
        preprocess: boolean;
        line_number: boolean;
        tab_replace: string;
    };
    default_category: string;
    default_tag: any;
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
    meta_generator: boolean;
};
declare type projectImportData = typeof project_config_data;
interface PrivateProjectConfig {
    [keys: string]: any;
    firebase: Parameters<typeof initializeApp>[0];
    ngrok: Ngrok.Options;
    root: string;
    tmp: typeof tmp;
}
export declare type ProjectConfig = projectImportData & PrivateProjectConfig & typeof default_project_config;
declare const config: ProjectConfig;
/**
 * is verbose activated?
 */
export declare const verbose: boolean;
/**
 * Public Source Post Dir ({@link config.source_dir})
 */
export declare const post_public_dir: string;
/**
 * Generated directory ({@link config.public_dir})
 */
export declare const post_generated_dir: string;
/**
 * `src-posts/` directory
 */
export declare const post_source_dir: string;
/**
 * path to temp folder
 * * cacheable
 * @param path file path inside temp folder
 * @returns
 */
export declare const tmp: (...path: string[]) => string;
/** THEME CONFIGS */
/** theme directory */
export declare const theme_dir: string;
/** _config.yml object from theme directory */
export declare const theme_yml: string;
/** merged theme config object */
export declare const theme_config: any;
export declare type ThemeOpt = typeof theme_config & {
    [key: string]: any;
};
/** EXPORT PRIVATE AND PUBLIC CONFIGS */
export default config;
export declare const project_config: ProjectConfig;
