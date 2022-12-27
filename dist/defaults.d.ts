export declare function getDefaultConfig(): {
    title: string;
    subtitle: string;
    description: string;
    keywords: null;
    author: string;
    language: string;
    timezone: string;
    url: string;
    root: string;
    permalink: string;
    permalink_defaults: null;
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
    skip_render: null;
    new_post_name: string;
    default_layout: string;
    titlecase: boolean;
    external_link: {
        enable: boolean;
        field: string;
        exclude: string[];
    };
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
    category_map: null;
    tag_map: null;
    meta_generator: boolean;
    date_format: string;
    time_format: string;
    updated_option: string;
    per_page: number;
    pagination_dir: string;
    include: null;
    exclude: null;
    ignore: null;
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
        enable_rules: null;
        disable_rules: null;
        plugins: null;
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
    };
    deploy: {
        type: string;
        repo: string;
        branch: string;
        username: string;
        email: string;
        message: string;
    };
    sitemap: {
        tags: boolean;
        categories: boolean;
    };
    tags: {
        lowercase: boolean;
        assign: null;
        mapper: {
            JS: string;
            TS: string;
        };
    };
    categories: {
        lowercase: boolean;
        assign: {
            TS: string;
            JS: string;
            Typescript: string;
            Javascript: string;
            GitHub: string;
        };
        mapper: {
            JS: string;
            TS: string;
        };
    };
};
export declare function getDefaultConfigYaml(): string;
