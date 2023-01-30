import mappedConfig from './_config.json';
export type importConfig = typeof mappedConfig;
/**
 * get default configuration
 * @returns
 */
export declare function getDefaultConfig(): {
    title: string;
    description: string;
    keywords: any;
    author: string;
    language: string;
    timezone: string;
    url: string;
    root: string;
    permalink: string;
    permalink_defaults: any;
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
    skip_render: any;
    new_post_name: string;
    default_layout: string;
    titlecase: boolean;
    filename_case: number;
    render_drafts: boolean;
    post_asset_folder: boolean;
    relative_link: boolean;
    future: boolean;
    highlight: {
        enable: boolean;
        line_number: boolean;
        auto_detect: boolean;
        tab_replace: string;
        wrap: boolean;
        hljs: boolean;
    };
    prismjs: {
        enable: boolean;
    };
    index_generator: {
        path: string;
        per_page: number;
        order_by: string;
    };
    default_category: string;
    meta_generator: boolean;
    date_format: string;
    time_format: string;
    updated_option: string;
    per_page: number;
    pagination_dir: string;
    include: any;
    exclude: any;
    ignore: any;
    theme: string;
    markdown: {
        preset: string;
        render: {
            html: boolean;
            xhtmlOut: boolean;
            langPrefix: string;
            breaks: boolean;
            linkify: boolean;
            typographer: boolean;
            quotes: string;
        };
        enable_rules: any;
        disable_rules: any;
        plugins: any;
        anchors: {
            level: number;
            collisionSuffix: string;
            permalink: boolean;
            permalinkClass: string;
            permalinkSide: string;
            permalinkSymbol: string;
            case: number;
            separator: string;
        };
    };
    browsersync: {
        logLevel: string;
        ghostMode: {
            scroll: boolean;
        };
        instanceName: string;
    };
    generator: {
        cache: boolean;
        verbose: boolean;
    };
    post_dir: string;
    deploy: {
        type: string;
        repo: string;
        branch: string;
        username: string;
        email: string;
        message: string;
    };
    tags: {
        lowercase: boolean;
        assign: any;
        mapper: any;
    };
    categories: {
        lowercase: boolean;
        assign: any;
        mapper: any;
    };
    external_link: {
        enable: boolean;
        field: string;
        safelink: {
            enable: boolean;
            exclude: string[];
            redirect: string[];
            type: string;
            password: string;
        };
        exclude: string[];
    };
};
/**
 * get default _config.yml
 * @returns
 */
export declare function getDefaultConfigYaml(): string;
