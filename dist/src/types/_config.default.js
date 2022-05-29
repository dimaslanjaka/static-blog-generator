"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_config = void 0;
exports.default_config = {
    // Site
    title: 'Hexo',
    subtitle: '',
    description: '',
    author: 'John Doe',
    language: 'en',
    timezone: '',
    // URL
    url: 'http://example.com',
    root: '/',
    permalink: ':year/:month/:day/:title/',
    permalink_defaults: {},
    pretty_urls: {
        trailing_index: true,
        trailing_html: true
    },
    // Directory
    source_dir: 'source',
    public_dir: 'public',
    tag_dir: 'tags',
    archive_dir: 'archives',
    category_dir: 'categories',
    code_dir: 'downloads/code',
    i18n_dir: ':lang',
    skip_render: [],
    // Mapper
    title_map: {},
    tag_map: {},
    category_map: {},
    tag_group: {},
    category_group: {},
    // Writing
    new_post_name: ':title.md',
    default_layout: 'post',
    titlecase: false,
    external_link: {
        enable: true,
        field: 'site',
        exclude: ''
    },
    filename_case: 0,
    render_drafts: false,
    post_asset_folder: false,
    relative_link: false,
    future: true,
    highlight: {
        enable: true,
        auto_detect: false,
        line_number: true,
        tab_replace: '',
        wrap: true,
        exclude_languages: [],
        hljs: false
    },
    prismjs: {
        enable: false,
        preprocess: true,
        line_number: true,
        tab_replace: ''
    },
    // Category & Tag
    default_category: 'uncategorized',
    default_tag: null,
    // Date / Time format
    date_format: 'YYYY-MM-DD',
    time_format: 'HH:mm:ss',
    updated_option: 'mtime',
    // * mtime: file modification date (default)
    // * date: use_date_for_updated
    // * empty: no more update
    // Pagination
    per_page: 10,
    pagination_dir: 'page',
    // Extensions
    theme: 'landscape',
    server: {
        cache: false
    },
    // Deployment
    deploy: {},
    // ignore files from processing
    ignore: [],
    // Category & Tag
    meta_generator: true,
    // custom
    exclude: [],
    include: [],
    /**
     * if set = true, otherwise undefined
     */
    verbose: false,
    adsense: {
        enable: false,
        article_ads: [],
        multiplex_ads: []
    },
    firebase: {
        apiKey: null,
        authDomain: null,
        projectId: null,
        storageBucket: null,
        messagingSenderId: null,
        appId: null,
        measurementId: null
    },
    ngrok: {
        token: null
    },
    generator: {
        cache: true
    }
};
exports.default = exports.default_config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5kZWZhdWx0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3R5cGVzL19jb25maWcuZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGNBQWMsR0FBRztJQUM1QixPQUFPO0lBQ1AsS0FBSyxFQUFFLE1BQU07SUFDYixRQUFRLEVBQUUsRUFBRTtJQUNaLFdBQVcsRUFBRSxFQUFFO0lBQ2YsTUFBTSxFQUFFLFVBQVU7SUFDbEIsUUFBUSxFQUFFLElBQUk7SUFDZCxRQUFRLEVBQUUsRUFBRTtJQUNaLE1BQU07SUFDTixHQUFHLEVBQUUsb0JBQW9CO0lBQ3pCLElBQUksRUFBRSxHQUFHO0lBQ1QsU0FBUyxFQUFFLDJCQUEyQjtJQUN0QyxrQkFBa0IsRUFBRSxFQUFFO0lBQ3RCLFdBQVcsRUFBRTtRQUNYLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGFBQWEsRUFBRSxJQUFJO0tBQ3BCO0lBQ0QsWUFBWTtJQUNaLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLE9BQU8sRUFBRSxNQUFNO0lBQ2YsV0FBVyxFQUFFLFVBQVU7SUFDdkIsWUFBWSxFQUFFLFlBQVk7SUFDMUIsUUFBUSxFQUFFLGdCQUFnQjtJQUMxQixRQUFRLEVBQUUsT0FBTztJQUNqQixXQUFXLEVBQUUsRUFBRTtJQUNmLFNBQVM7SUFDVCxTQUFTLEVBQUUsRUFBRTtJQUNiLE9BQU8sRUFBRSxFQUFFO0lBQ1gsWUFBWSxFQUFFLEVBQUU7SUFDaEIsU0FBUyxFQUFFLEVBQUU7SUFDYixjQUFjLEVBQUUsRUFBRTtJQUNsQixVQUFVO0lBQ1YsYUFBYSxFQUFFLFdBQVc7SUFDMUIsY0FBYyxFQUFFLE1BQU07SUFDdEIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsYUFBYSxFQUFFO1FBQ2IsTUFBTSxFQUFFLElBQUk7UUFDWixLQUFLLEVBQUUsTUFBTTtRQUNiLE9BQU8sRUFBRSxFQUFFO0tBQ1o7SUFDRCxhQUFhLEVBQUUsQ0FBQztJQUNoQixhQUFhLEVBQUUsS0FBSztJQUNwQixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLE1BQU0sRUFBRSxJQUFJO0lBQ1osU0FBUyxFQUFFO1FBQ1QsTUFBTSxFQUFFLElBQUk7UUFDWixXQUFXLEVBQUUsS0FBSztRQUNsQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsRUFBRTtRQUNmLElBQUksRUFBRSxJQUFJO1FBQ1YsaUJBQWlCLEVBQUUsRUFBRTtRQUNyQixJQUFJLEVBQUUsS0FBSztLQUNaO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLEtBQUs7UUFDYixVQUFVLEVBQUUsSUFBSTtRQUNoQixXQUFXLEVBQUUsSUFBSTtRQUNqQixXQUFXLEVBQUUsRUFBRTtLQUNoQjtJQUNELGlCQUFpQjtJQUNqQixnQkFBZ0IsRUFBRSxlQUFlO0lBQ2pDLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLHFCQUFxQjtJQUNyQixXQUFXLEVBQUUsWUFBWTtJQUN6QixXQUFXLEVBQUUsVUFBVTtJQUN2QixjQUFjLEVBQUUsT0FBTztJQUN2Qiw0Q0FBNEM7SUFDNUMsK0JBQStCO0lBQy9CLDBCQUEwQjtJQUMxQixhQUFhO0lBQ2IsUUFBUSxFQUFFLEVBQUU7SUFDWixjQUFjLEVBQUUsTUFBTTtJQUN0QixhQUFhO0lBQ2IsS0FBSyxFQUFFLFdBQVc7SUFDbEIsTUFBTSxFQUFFO1FBQ04sS0FBSyxFQUFFLEtBQUs7S0FDYjtJQUNELGFBQWE7SUFDYixNQUFNLEVBQUUsRUFBRTtJQUVWLCtCQUErQjtJQUMvQixNQUFNLEVBQUUsRUFBRTtJQUVWLGlCQUFpQjtJQUNqQixjQUFjLEVBQUUsSUFBSTtJQUVwQixTQUFTO0lBQ1QsT0FBTyxFQUFFLEVBQUU7SUFDWCxPQUFPLEVBQUUsRUFBRTtJQUNYOztPQUVHO0lBQ0gsT0FBTyxFQUFFLEtBQUs7SUFDZCxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUsS0FBSztRQUNiLFdBQVcsRUFBRSxFQUFjO1FBQzNCLGFBQWEsRUFBRSxFQUFjO0tBQzlCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsTUFBTSxFQUFFLElBQUk7UUFDWixVQUFVLEVBQUUsSUFBSTtRQUNoQixTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGlCQUFpQixFQUFFLElBQUk7UUFDdkIsS0FBSyxFQUFFLElBQUk7UUFDWCxhQUFhLEVBQUUsSUFBSTtLQUNwQjtJQUNELEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxTQUFTLEVBQUU7UUFDVCxLQUFLLEVBQUUsSUFBSTtLQUNaO0NBQ0YsQ0FBQztBQUNGLGtCQUFlLHNCQUFjLENBQUMifQ==