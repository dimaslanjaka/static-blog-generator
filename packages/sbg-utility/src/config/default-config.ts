import fs from 'fs-extra';
import url from 'node:url';
import path from 'upath';
import * as yaml from 'yaml';
import { jsonStringifyWithCircularRefs } from '../utils/JSON';
import { normalizePath } from '../utils/filemanager/normalizePath';
// import mappedConfig from './_config.json' assert { type: 'json' };

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mappedConfig: typeof import('./_config.json') = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_config.json'), 'utf-8')
);
export type importConfig = typeof mappedConfig;

/**
 * get default configuration
 * @returns
 */
export function getDefaultConfig() {
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
    // cwd: normalizePath(trueCasePathSync(process.cwd()))
    cwd: normalizePath(process.cwd())
  };
  const configYML = yaml.parse(getDefaultConfigYaml());
  return Object.assign(hexoDefaultConfig, sbgDefaultConfig, configYML) as importConfig;
}

/**
 * get default _config.yml
 * @returns
 */
export function getDefaultConfigYaml() {
  const yml = path.join(__dirname, '_config.yml');
  if (fs.existsSync(yml)) {
    return fs.readFileSync(path.join(__dirname, '_config.yml'), 'utf-8');
  } else {
    return jsonStringifyWithCircularRefs(mappedConfig);
  }
}
