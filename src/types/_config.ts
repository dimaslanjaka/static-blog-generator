import { deepmerge } from 'deepmerge-ts';
import { existsSync, readFileSync } from 'fs';
import HexoConfig from 'hexo/HexoConfig';
import { cwd } from 'process';
import { join } from 'upath';
import yaml from 'yaml';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).argv;
const nocache = argv['nocache'];
const verbose = argv['verbose'];

let defaultSiteOptions = {
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
  }
};

export function getConfig() {
  // find _config.yml
  const file = join(process.cwd(), '_config.yml');
  // console.log('finding', file);
  if (existsSync(file)) {
    const readConfig = readFileSync(file, 'utf-8');
    const parse = yaml.parse(readConfig);
    defaultSiteOptions = deepmerge(defaultSiteOptions, parse, {
      verbose,
      generator: {
        cache: !nocache
      }
    }) as unknown as typeof defaultSiteOptions;
    //console.log(defaultSiteOptions.url);
  } else {
    console.log(file, 'not found');
  }
  return defaultSiteOptions;
}

export { verbose, nocache };

export interface ProjectConfig extends HexoConfig {
  [key: string]: any;
  /**
   * Source posts
   */
  post_dir: string;
  /**
   * Project CWD
   */
  cwd: string;
}

/**
 * Hexo Generated Dir
 */
export const post_generated_dir = join(cwd(), getConfig().public_dir);
/**
 * SBG Source Post Dir
 */
export const post_source_dir = join(cwd(), 'src-posts');
