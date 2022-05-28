export const default_config = {
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
    article_ads: [] as string[],
    multiplex_ads: [] as string[]
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
export default default_config;
