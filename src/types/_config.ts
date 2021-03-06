import { deepmerge } from 'deepmerge-ts';
import { initializeApp } from 'firebase/app';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import memoizee from 'memoizee';
import { Ngrok } from 'ngrok';
import { join, resolve, toUnix } from 'upath';
import { inspect } from 'util';
import yaml from 'yaml';
import yargs from 'yargs';
import '../a-core';
import { crossNormalize, read, write } from '../node/filemanager';
import { json_encode } from '../node/JSON';
import { sortedObject } from '../node/object-utility';
import { yamlParse } from '../parser/yaml';
import default_config from './_config.default';
import project_config_data from './_config_project.json';
import theme_config_data from './_config_theme.json';

/**
 * Argument CLI reader
 */
export const argv = yargs(process.argv.slice(2)).argv;

/** EXPORT PRIVATE AND PUBLIC CONFIGS */
export { root, theme_dir, theme_yml };

/**
 * process cwd unix style
 */
const root = toUnix(process.cwd());
export const cwd = memoizee(() => toUnix(process.cwd()));
const file = join(root, '_config.yml');

const readConfig = existsSync(file) ? readFileSync(file, 'utf-8') : '';
/** default project config */
export const default_project_config = default_config;

type projectImportData = typeof project_config_data;
interface PrivateProjectConfig {
  [keys: string]: any;
  firebase: Parameters<typeof initializeApp>[0];
  ngrok: Ngrok.Options;
  root: string;
  tmp: typeof tmp;
}

const project_config_merge = Object.assign(
  default_project_config,
  yamlParse(readConfig)
);

export type ProjectConfig = projectImportData &
  PrivateProjectConfig &
  typeof default_project_config & {
    env: string;
  };

// @todo [config] set env
project_config_merge['env'] = process.env['NODE_ENV'];

// @todo [config] resolve adsense
if ('adsense' in project_config_merge) {
  const adsense = project_config_merge.adsense;
  if ('enable' in adsense && adsense.enable) {
    const findads = (path: string) => {
      let findpath = join(cwd(), path);
      if (!existsSync(findpath)) {
        findpath = join(root, path);
      }
      if (existsSync(findpath)) return String(read(findpath));
    };

    if ('article_ads' in adsense) {
      if (Array.isArray(adsense.article_ads)) {
        if (adsense.article_ads.length) {
          project_config_merge.adsense.article_ads =
            adsense.article_ads.map(findads);
        }
      }
    }

    if ('multiplex_ads' in adsense) {
      if (Array.isArray(adsense.multiplex_ads)) {
        if (adsense.multiplex_ads.length) {
          adsense.multiplex_ads =
            project_config_merge.adsense.multiplex_ads.map(findads);
        }
      }
    }
  }
}

let config = project_config_merge as ProjectConfig;

// @todo assign config cached to object config
const cached_config = join(cwd(), '_config.cached.yml');
if (existsSync(cached_config)) {
  config = deepmerge(config, yamlParse<ProjectConfig>(cached_config));
  if (config.env === 'development')
    write(join(__dirname, 'tmp/_config.log'), inspect(config));
}

/**
 * Config Deployment
 */
export const configDeploy = config.deploy;
/**
 * Deployment Directory
 */
export const deployDir = resolve(
  join(process.cwd(), '.deploy_' + config.deploy.type)
);

// @todo [config] bypass nocache if --nocache argument is set by cli
if (argv['nocache']) {
  if ('generator' in config === false)
    config['generator'] = {
      cache: false,
      type: null,
      copy: {
        posts: {
          space: true
        }
      }
    };
  if ('cache' in config.generator) config['generator']['cache'] = false;
}
// @todo [config] bypass verbose if --verbose argument is set by cli
if (argv['verbose']) config.verbose = true;
// @todo [config] bypass environment favor if --dev or --development argument is set by cli
if (argv['dev'] || argv['development']) config.env = 'development';

/**
 * is process using cache strategy?
 */
export const useCache = config.generator.cache;

/**
 * is verbose activated?
 */
export const verbose = config.verbose;
export const isDev = config.env === 'development';

config.url = config.url.replace(/\/+$/, '');

/**
 * Public Source Post Dir ({@link config.source_dir})
 */
export const post_public_dir = crossNormalize(
  resolve(join(root, config.source_dir, '_posts'))
);
/**
 * Generated directory ({@link config.public_dir})
 */
export const post_generated_dir = crossNormalize(
  resolve(join(root, config.public_dir))
);

/**
 * `src-posts/` directory
 */
export const post_source_dir = crossNormalize(resolve(join(root, 'src-posts')));

/**
 * path to temp folder
 * * cacheable
 * @param path file path inside temp folder
 * @returns
 */
export const tmp = (...path: string[]) => {
  return join(root, 'tmp', path.filter((s) => s).join('/'));
};

if (!existsSync(tmp()))
  try {
    mkdirSync(tmp());
  } catch {
    //
  }

/** THEME CONFIGS */
/** theme directory */
let theme_dir = toUnix(resolve(join(root, 'themes', config.theme)));
if (!existsSync(theme_dir)) {
  theme_dir = join(process.cwd(), 'node_modules', 'sbg-theme-' + config.theme);
  if (!existsSync(theme_dir)) {
    theme_dir = join(process.cwd(), 'node_modules', config.theme);
  }
}
/** _config.yml object from theme directory */
const theme_yml = join(theme_dir, '_config.yml');
/** merged theme config object */
export const theme_config = Object.assign(
  theme_config_data,
  existsSync(theme_yml) ? yaml.parse(readFileSync(theme_yml, 'utf-8')) : {}
);
export type ThemeOpt = typeof theme_config & {
  [key: string]: any;
};

/** WRITE AUTO GENERATED CONFIGS */

write(
  join(__dirname, '_config_project.json'),
  json_encode(isDev ? sortedObject(config) : config)
);
write(
  join(__dirname, '_config_theme.json'),
  json_encode(isDev ? sortedObject(theme_config) : theme_config)
);

/** SETUP PRIVATE CONFIGS */
const file_private_config = join(root, '_config.private.yml');
if (existsSync(file_private_config)) {
  const privateConfig: PrivateProjectConfig = yaml.parse(
    readFileSync(file_private_config, 'utf-8')
  );
  if (Object.hasOwnProperty.call(privateConfig, 'firebase')) {
    config.firebase = <any>privateConfig.firebase;
  }
}

/**
 * get config
 * @returns
 */
export function getConfig(): typeof project_config_data {
  return config;
}

config.root = root;
config.tmp = tmp;

export default config;
export const project_config = config;
