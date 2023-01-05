import { existsSync, readFileSync, writeFileSync } from 'fs';
import HexoConfig from 'hexo/HexoConfig';
import { cwd } from 'process';
import { join } from 'upath';
import yaml from 'yaml';
import yargs from 'yargs';
import data from './_config_project.json';

const argv = yargs(process.argv.slice(2)).argv;
const nocache = argv['nocache'];
const verbose = argv['verbose'];

const defaultOptions = {
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

type MergeData = Partial<typeof data> & Partial<typeof defaultOptions>;
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

let config = defaultOptions;

// find _config.yml
const file = join(process.cwd(), '_config.yml');
if (existsSync(file)) {
  const readConfig = readFileSync(file, 'utf-8');
  const parse = yaml.parse(readConfig) as typeof data;
  config = Object.assign(defaultOptions, parse, {
    verbose,
    generator: {
      cache: !nocache
    }
  });
}

writeFileSync(
  join(__dirname, '_config_project.json'),
  JSON.stringify(config, null, 2)
);

export { verbose, nocache };
export default config as Config;
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
export const post_generated_dir = join(cwd(), config.public_dir);
/**
 * SBG Source Post Dir
 */
export const post_source_dir = join(cwd(), 'src-posts');
