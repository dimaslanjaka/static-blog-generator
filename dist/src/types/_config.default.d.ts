export declare const default_config: {
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
    ignore: any[];
    meta_generator: boolean;
    exclude: any[];
    include: any[];
    /**
     * if set = true, otherwise undefined
     */
    verbose: boolean;
    adsense: {
        enable: boolean;
        article_ads: string[];
        multiplex_ads: string[];
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
};
export default default_config;
