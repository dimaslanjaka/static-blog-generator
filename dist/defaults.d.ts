export declare function getDefaultConfig(): {
    title: string;
    subtitle: string;
    description: string;
    keywords: string;
    language: string[];
    timezone: string;
    search: {
        path: string;
        field: string;
        content: boolean;
        format: string;
    };
    url: string;
    root: string;
    permalink: string;
    permalink_defaults: string;
    pretty_urls: {
        trailing_index: boolean;
        trailing_html: boolean;
    };
    source_dir: string;
    public_dir: string;
    post_dir: string;
    tag_dir: string;
    archive_dir: string;
    category_dir: string;
    code_dir: string;
    i18n_dir: string;
    new_post_name: string;
    default_layout: string;
    titlecase: boolean;
    external_link: {
        enable: boolean;
        field: string;
        safelink: {
            enable: boolean;
            exclude: string[];
            redirect: string;
            type: string;
            password: string;
        };
        exclude: string[];
    };
    filename_case: number;
    render_drafts: boolean;
    post_asset_folder: boolean;
    marked: {
        prependRoot: boolean;
        postAsset: boolean;
    };
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
        preprocess: boolean;
        line_number: boolean;
        tab_replace: string;
    };
    index_generator: {
        path: string;
        per_page: number;
        order_by: string;
    };
    default_category: string;
    default_tag: null;
    category_map: null;
    tag_map: null;
    meta_generator: boolean;
    date_format: string;
    time_format: string;
    updated_option: boolean;
    per_page: number;
    pagination_dir: string;
    include: string[];
    exclude: string[];
    ignore: string[];
    skip_render: string[];
    server: {
        port: number;
        log: boolean;
        ip: string;
        compress: boolean;
        cache: boolean;
        header: boolean;
        serveStatic: {
            extensions: string[];
        };
    };
    theme: string;
    deploy: {
        type: string;
        repo: string;
        branch: string;
        message: string;
        hostname: string;
        username: string;
        email: string;
    };
    author: string;
    author_obj: {
        name: string;
        link: string;
        image: {
            url: string;
            width: number;
            height: number;
        };
    };
    social_links: {
        github: string;
        youtube: string;
    };
    feed: {
        icon: string;
        content: boolean;
        type: string[];
        path: string[];
    };
    sitemap: {
        path: string[];
        rel: boolean;
        tags: boolean;
        categories: boolean;
    };
    related_posts: {
        enabled: boolean;
        enable_env_name: string;
        filter_threshold: number;
        related_count: number;
        weight: {
            title: number;
            description: number;
            keywords: number;
            tags: number;
            categories: number;
            text: number;
        };
        stemmers: string[];
        reserved: string[];
    };
    markdown_it_plus: {
        highlight: boolean;
        html: boolean;
        xhtmlOut: boolean;
        breaks: boolean;
        langPrefix: null;
        linkify: boolean;
        typographer: null;
        pre_class: string;
        plugins: {
            plugin: {
                name: string;
                enable: boolean;
                options: {
                    leftDelimiter: string;
                    rightDelimiter: string;
                    allowedAttributes: never[];
                };
            };
        }[];
    };
    browsersync: {
        logLevel: string;
        ghostMode: {
            scroll: boolean;
        };
        instanceName: string;
        port: number;
        browser: string;
        open: boolean;
    };
    generator: {
        cache: boolean;
        type: string;
        copy: {
            posts: {
                space: boolean;
            };
        };
    };
    adsense: {
        enable: boolean;
        pub: string;
        article_ads: null;
        field: string;
        https: boolean;
        adblock: boolean;
        type: string;
        exclude: string[];
    };
    redirect: {
        enable: boolean;
    };
    analytics: {
        tagmanager: string;
        GA4: string;
        GA3: string;
        cloudflare: string;
    };
    seo: {
        html: {
            fix: boolean;
            exclude: string[];
        };
        css: boolean;
        js: boolean;
        schema: boolean;
        img: {
            broken: boolean;
            default: string;
            onerror: string;
        };
        links: {
            enable: boolean;
            exclude: string[];
        };
        sitemap: boolean;
    };
    tag_assign: null;
    category_assign: {
        TS: string;
        JS: string;
        Typescript: string;
        Javascript: string;
        GitHub: string;
    };
    tag_mapper: {
        JS: string;
        TS: string;
    };
    category_mapper: {
        JS: string;
        TS: string;
    };
};
export declare function getDefaultConfigYaml(): string;
