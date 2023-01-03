"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultConfigYaml = exports.getDefaultConfig = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
function getDefaultConfig() {
    var hexoDefaultConfig = {
        title: 'Hexo',
        subtitle: '',
        description: '',
        author: 'John Doe',
        language: 'en',
        timezone: '',
        url: 'http://example.com',
        root: '/',
        permalink: ':year/:month/:day/:title/',
        permalink_defaults: {},
        pretty_urls: {
            trailing_index: true,
            trailing_html: true
        },
        source_dir: 'source',
        public_dir: 'public',
        tag_dir: 'tags',
        archive_dir: 'archives',
        category_dir: 'categories',
        code_dir: 'downloads/code',
        i18n_dir: ':lang',
        skip_render: [],
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
        syntax_highlighter: 'highlight.js',
        highlight: {
            auto_detect: false,
            line_number: true,
            tab_replace: '',
            wrap: true,
            exclude_languages: [],
            language_attr: false,
            hljs: false
        },
        prismjs: {
            preprocess: true,
            line_number: true,
            tab_replace: ''
        },
        default_category: 'uncategorized',
        category_map: {},
        tag_map: {},
        date_format: 'YYYY-MM-DD',
        time_format: 'HH:mm:ss',
        updated_option: 'mtime',
        per_page: 10,
        pagination_dir: 'page',
        theme: 'landscape',
        server: {
            cache: false
        },
        deploy: {},
        ignore: [],
        meta_generator: true
    };
    var defaultConfig = { post_dir: 'src-posts', cwd: (0, upath_1.toUnix)(process.cwd()) };
    var configYML = yaml_1.default.parse(getDefaultConfigYaml());
    return Object.assign(hexoDefaultConfig, defaultConfig, configYML);
}
exports.getDefaultConfig = getDefaultConfig;
function getDefaultConfigYaml() {
    return (0, fs_1.readFileSync)((0, upath_1.join)(__dirname, '_config.yml'), 'utf-8');
}
exports.getDefaultConfigYaml = getDefaultConfigYaml;
