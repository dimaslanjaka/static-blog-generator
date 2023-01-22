"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_source_dir = exports.post_generated_dir = exports.nocache = exports.verbose = exports.setConfig = exports.getConfig = void 0;
const fs_1 = require("fs");
const process_1 = require("process");
const upath_1 = require("upath");
const yaml_1 = __importDefault(require("yaml"));
const yargs_1 = __importDefault(require("yargs"));
const argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
const nocache = argv['nocache'];
exports.nocache = nocache;
const verbose = argv['verbose'];
exports.verbose = verbose;
const defaultSiteOptions = {
    // Site
    title: 'Hexo',
    subtitle: '',
    description: '',
    author: 'L3n4r0x',
    language: 'en',
    timezone: 'UTC',
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
    // Category & Tag
    default_category: 'uncategorized',
    category_map: {},
    tag_map: {},
    // Date / Time format
    date_format: 'YYYY-MM-DD',
    time_format: 'HH:mm:ss',
    updated_option: 'mtime',
    // * mtime: file modification date (default)
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
    // hexo-post-parser cache indicator
    generator: {
        cache: true,
        type: 'hexo',
        verbose: false,
        amp: false
    },
    // static-blog-generator source post
    post_dir: 'src-posts'
};
let settledOptions = defaultSiteOptions;
// find _config.yml
const file = (0, upath_1.join)(process.cwd(), '_config.yml');
// console.log('finding', file);
if ((0, fs_1.existsSync)(file)) {
    const readConfig = (0, fs_1.readFileSync)(file, 'utf-8');
    const parse = yaml_1.default.parse(readConfig);
    settledOptions = Object.assign(settledOptions, parse, {
        verbose,
        generator: {
            cache: !nocache
        }
    });
} /*else {
  console.log(file, 'not found');
}*/
/**
 * get site _config.yml
 * @returns
 */
function getConfig() {
    return settledOptions;
}
exports.getConfig = getConfig;
/**
 * assign new option
 * @param obj
 * @returns
 */
function setConfig(obj) {
    settledOptions = Object.assign(settledOptions, obj);
    return settledOptions;
}
exports.setConfig = setConfig;
/**
 * Hexo Generated Dir
 */
exports.post_generated_dir = (0, upath_1.join)((0, process_1.cwd)(), getConfig().public_dir);
/**
 * SBG Source Post Dir
 */
exports.post_source_dir = (0, upath_1.join)((0, process_1.cwd)(), 'src-posts');
//# sourceMappingURL=_config.js.map