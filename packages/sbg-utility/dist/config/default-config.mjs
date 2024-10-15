import fs__default from 'fs-extra';
import url from 'node:url';
import path__default from 'upath';
import * as yaml from 'yaml';
import 'ansi-colors';
import 'stream';
import '../utils/logger.mjs';
import 'debug';
import { trueCasePathSync } from '../utils/filemanager/case-path.mjs';
import 'path';
import 'bluebird';
import 'minimatch';
import { normalizePath } from '../utils/filemanager/normalizePath.mjs';
import 'fs';
import 'micromatch';
import 'axios';
import 'crypto';
import 'glob';
import '../utils/JSON-serializer.mjs';
import { jsonStringifyWithCircularRefs } from '../utils/JSON.mjs';
import '../utils/lockmanager.mjs';
import 'hexo-util';
import 'nunjucks';
import '../utils/promisify.mjs';
import '../utils/scheduler.mjs';

// import mappedConfig from './_config.json' assert { type: 'json' };
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path__default.dirname(__filename);
const mappedConfig = JSON.parse(fs__default.readFileSync(path__default.join(__dirname, '_config.json'), 'utf-8'));
/**
 * get default configuration
 * @returns
 */
function getDefaultConfig() {
    const hexoDefaultConfig = {
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
        permalink: ':year/:month/:day/:name/',
        permalink_defaults: {},
        pretty_urls: {
            trailing_index: true,
            trailing_html: true
        },
        // Directory
        post_dir: 'src-posts',
        // deploy_dir: '.deploy_git',
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
        meta_generator: true
    };
    const sbgDefaultConfig = {
        cwd: normalizePath(trueCasePathSync(process.cwd()))
    };
    const configYML = yaml.parse(getDefaultConfigYaml());
    return Object.assign(hexoDefaultConfig, sbgDefaultConfig, configYML);
}
/**
 * get default _config.yml
 * @returns
 */
function getDefaultConfigYaml() {
    const yml = path__default.join(__dirname, '_config.yml');
    if (fs__default.existsSync(yml)) {
        return fs__default.readFileSync(path__default.join(__dirname, '_config.yml'), 'utf-8');
    }
    else {
        return jsonStringifyWithCircularRefs(mappedConfig);
    }
}

export { getDefaultConfig, getDefaultConfigYaml };
