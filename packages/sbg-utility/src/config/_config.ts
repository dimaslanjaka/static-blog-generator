import fs from 'fs-extra';
import Hexo from 'hexo';
import url from 'node:url';
import path from 'upath';
import yaml from 'yaml';
import * as utils from '../utils';
import { writefile } from '../utils/filemanager';
import * as defaults from './default-config';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFileJSON = path.join(__dirname, '_config.json');
if (!fs.existsSync(configFileJSON)) fs.writeFileSync(configFileJSON, '{}');

export type HexoConfig = Hexo['config'];

export interface ProjConf extends HexoConfig {
  [key: string]: any;
  /**
   * Source posts
   */
  post_dir: string;
  /**
   * deployment directory (can be absolute path)
   * @example
   * \<project\>/.deploy_git
   * ```yaml
   * deploy_dir: .deploy_git
   * ```
   * at somewhere on your pc
   * ```yaml
   * deploy_dir: '/usr/home/site/my username'
   * ```
   */
  deploy_dir: string;
  /**
   * Project CWD
   */
  cwd: string;
  /**
   * Deployment options
   */
  deploy: HexoConfig['deploy'] &
    defaults.importConfig['deploy'] &
    ReturnType<typeof deployConfig> & {
      /**
       * copy to subfolder of site
       * @example
       * deployment location at \<project\>/.deploy_git/docs
       * ```yaml
       * deploy_dir: .deploy_git
       * deploy:
       *  folder: docs
       * ```
       */
      folder?: string;
    };
  external_link: HexoConfig['external_link'] &
    defaults.importConfig['external_link'] &
    boolean & {
      safelink?: import('safelinkify').SafelinkOptions;
    };

  /**
   * global ignore
   */
  exclude: string[];

  generator: {
    [key: string]: any;
    cache: boolean;
    verbose: boolean;
  };

  /**
   * Tags mapper
   */
  tags?: LabelMapper;
  /**
   * Categories mapper
   */
  categories?: LabelMapper;
}

export interface LabelMapper {
  /**
   * turn label to lower case
   */
  lowercase: boolean;
  /**
   * add old label with new label
   */
  assign: Record<string, string> | undefined | null;
  /**
   * replace old label with new label
   */
  mapper: Record<string, string> | undefined | null;
}

let settledConfig = defaults.getDefaultConfig() as Record<string, any>;

/**
 * find `_config.yml`
 * @param fileYML path to file `_config.yml` or working directory
 */
export function fetchConfig(fileYML?: string) {
  if (!fileYML) {
    fileYML = path.join(process.cwd(), '_config.yml');
  } else if (!fileYML.endsWith('_config.yml')) {
    fileYML += '/_config.yml';
  }
  const configYML = yaml.parse(fs.readFileSync(path.resolve(fileYML), 'utf-8'));
  setConfig(utils.orderKeys(configYML));
  writefile(configFileJSON, JSON.stringify(configYML, null, 2));
}

// fetch _config.yml first init
// fetchConfig(join(process.cwd(), '_config.yml'));

/**
 * Config setter
 * * useful for jest
 * @param obj
 */
export function setConfig(obj: Record<string, any> | ProjConf) {
  settledConfig = Object.assign(settledConfig || {}, obj);

  return getConfig();
}

/**
 * Config getter
 * * useful for jest
 * @returns
 */
export function getConfig() {
  settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
  return settledConfig as ProjConf;
}

/**
 * get deployment config
 * @returns
 */
export function deployConfig() {
  let deployDir: string;
  if (settledConfig.deploy_dir) {
    // deploy_dir was set
    deployDir = settledConfig.deploy_dir;
  } else {
    // fallback get from deploy.type
    deployDir = path.join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
  }
  // subfolder - assign deploy.folder
  if (settledConfig.deploy.folder) {
    deployDir = path.join(deployDir, settledConfig.folder);
  }
  return { deployDir };
}

/**
 * common ignore files
 * @example
 * const config = getConfig();
 * const excludes = Array.isArray(config.exclude) ? config.exclude : [];
 * excludes.push(...commonIgnore);
 */
export const commonIgnore = [
  '**/yandex_*.html', // skip yandex verification file
  // '**/comments.html',
  // '**/disqus-comments.html',
  // '**/comment.html', // skip comment.html
  '**/favicon.html', // skip favicon
  '**/404.html', // skip 404
  '**/node_modules/**', // skip node_modules
  '**/tmp/**', // skip tmp
  '**/build/**', // skip build
  '**/.cache/**', // skip common cache folder
  '**/.vscode/**', // skip vscode configuration folder
  '**/.frontmatter/**', // skip frontmatter vscode extension
  '**/pinterest-*.html', // skip pinterest verification file
  '**/_*.standalone.{js,ts}', // skip _filename.standalone.js
  '**/desktop.ini', // windows desktop.ini
  '**/node_modules/**', // node_modules
  '**/.frontmatter/**', // vscode frontmatter plugin
  '**/.git*/**', // any git configs
  '**/.*' // skip dots
];

/**
 * array of config.exclude, config.ignore
 */
export const projectIgnores = [...(getConfig().skip_render || []), ...(getConfig().ignore || [])];
