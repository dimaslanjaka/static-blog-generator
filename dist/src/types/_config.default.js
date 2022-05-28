"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
    meta_generator: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5kZWZhdWx0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3R5cGVzL19jb25maWcuZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtCQUFlO0lBQ2IsT0FBTztJQUNQLEtBQUssRUFBRSxNQUFNO0lBQ2IsUUFBUSxFQUFFLEVBQUU7SUFDWixXQUFXLEVBQUUsRUFBRTtJQUNmLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLEVBQUU7SUFDWixNQUFNO0lBQ04sR0FBRyxFQUFFLG9CQUFvQjtJQUN6QixJQUFJLEVBQUUsR0FBRztJQUNULFNBQVMsRUFBRSwyQkFBMkI7SUFDdEMsa0JBQWtCLEVBQUUsRUFBRTtJQUN0QixXQUFXLEVBQUU7UUFDWCxjQUFjLEVBQUUsSUFBSTtRQUNwQixhQUFhLEVBQUUsSUFBSTtLQUNwQjtJQUNELFlBQVk7SUFDWixVQUFVLEVBQUUsUUFBUTtJQUNwQixVQUFVLEVBQUUsUUFBUTtJQUNwQixPQUFPLEVBQUUsTUFBTTtJQUNmLFdBQVcsRUFBRSxVQUFVO0lBQ3ZCLFlBQVksRUFBRSxZQUFZO0lBQzFCLFFBQVEsRUFBRSxnQkFBZ0I7SUFDMUIsUUFBUSxFQUFFLE9BQU87SUFDakIsV0FBVyxFQUFFLEVBQUU7SUFDZixTQUFTO0lBQ1QsU0FBUyxFQUFFLEVBQUU7SUFDYixPQUFPLEVBQUUsRUFBRTtJQUNYLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFNBQVMsRUFBRSxFQUFFO0lBQ2IsY0FBYyxFQUFFLEVBQUU7SUFDbEIsVUFBVTtJQUNWLGFBQWEsRUFBRSxXQUFXO0lBQzFCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLGFBQWEsRUFBRTtRQUNiLE1BQU0sRUFBRSxJQUFJO1FBQ1osS0FBSyxFQUFFLE1BQU07UUFDYixPQUFPLEVBQUUsRUFBRTtLQUNaO0lBQ0QsYUFBYSxFQUFFLENBQUM7SUFDaEIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsaUJBQWlCLEVBQUUsS0FBSztJQUN4QixhQUFhLEVBQUUsS0FBSztJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLFNBQVMsRUFBRTtRQUNULE1BQU0sRUFBRSxJQUFJO1FBQ1osV0FBVyxFQUFFLEtBQUs7UUFDbEIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLEVBQUU7UUFDZixJQUFJLEVBQUUsSUFBSTtRQUNWLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsSUFBSSxFQUFFLEtBQUs7S0FDWjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxLQUFLO1FBQ2IsVUFBVSxFQUFFLElBQUk7UUFDaEIsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLEVBQUU7S0FDaEI7SUFDRCxpQkFBaUI7SUFDakIsZ0JBQWdCLEVBQUUsZUFBZTtJQUNqQyxXQUFXLEVBQUUsSUFBSTtJQUNqQixxQkFBcUI7SUFDckIsV0FBVyxFQUFFLFlBQVk7SUFDekIsV0FBVyxFQUFFLFVBQVU7SUFDdkIsY0FBYyxFQUFFLE9BQU87SUFDdkIsNENBQTRDO0lBQzVDLCtCQUErQjtJQUMvQiwwQkFBMEI7SUFDMUIsYUFBYTtJQUNiLFFBQVEsRUFBRSxFQUFFO0lBQ1osY0FBYyxFQUFFLE1BQU07SUFDdEIsYUFBYTtJQUNiLEtBQUssRUFBRSxXQUFXO0lBQ2xCLE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRSxLQUFLO0tBQ2I7SUFDRCxhQUFhO0lBQ2IsTUFBTSxFQUFFLEVBQUU7SUFFViwrQkFBK0I7SUFDL0IsTUFBTSxFQUFFLEVBQUU7SUFFVixpQkFBaUI7SUFDakIsY0FBYyxFQUFFLElBQUk7Q0FDckIsQ0FBQyJ9