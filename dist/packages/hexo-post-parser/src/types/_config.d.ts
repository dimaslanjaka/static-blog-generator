import data from './_config_project.json';
declare const def: {
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
};
declare type MergeData = Partial<typeof data> & Partial<typeof def>;
interface Config extends Partial<MergeData> {
    verbose?: boolean;
    generator?: {
        cache: boolean;
    };
    amp?: any;
    default_tag?: string;
    default_category?: string;
    content?: string;
}
declare let config: {
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
};
declare const _default: Config;
export default _default;
export interface ProjectConfig extends Partial<typeof config> {
    [key: string]: any;
}
