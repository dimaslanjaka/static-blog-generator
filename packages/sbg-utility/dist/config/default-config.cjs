'use strict';

var fs = require('fs-extra');
var url = require('node:url');
var path = require('upath');
var yaml = require('yaml');
require('ansi-colors');
require('stream');
require('../utils/logger.cjs');
require('debug');
var casePath = require('../utils/filemanager/case-path.cjs');
require('path');
require('bluebird');
require('minimatch');
var normalizePath = require('../utils/filemanager/normalizePath.cjs');
require('axios');
require('crypto');
require('glob');
require('../utils/JSON-serializer.cjs');
var JSON$1 = require('../utils/JSON.cjs');
require('../utils/lockmanager.cjs');
require('fs');
require('micromatch');
require('hexo-util');
require('nunjucks');
require('../utils/promisify.cjs');
require('../utils/scheduler.cjs');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var yaml__namespace = /*#__PURE__*/_interopNamespaceDefault(yaml);

// import mappedConfig from './_config.json' assert { type: 'json' };
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('config/default-config.cjs', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);
const mappedConfig = JSON.parse(fs.readFileSync(path.join(__dirname$1, '_config.json'), 'utf-8'));
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
        cwd: normalizePath.normalizePath(casePath.trueCasePathSync(process.cwd()))
    };
    const configYML = yaml__namespace.parse(getDefaultConfigYaml());
    return Object.assign(hexoDefaultConfig, sbgDefaultConfig, configYML);
}
/**
 * get default _config.yml
 * @returns
 */
function getDefaultConfigYaml() {
    const yml = path.join(__dirname$1, '_config.yml');
    if (fs.existsSync(yml)) {
        return fs.readFileSync(path.join(__dirname$1, '_config.yml'), 'utf-8');
    }
    else {
        return JSON$1.jsonStringifyWithCircularRefs(mappedConfig);
    }
}

exports.getDefaultConfig = getDefaultConfig;
exports.getDefaultConfigYaml = getDefaultConfigYaml;
