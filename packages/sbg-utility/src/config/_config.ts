import fs from 'fs-extra';
import git from 'git-command-helper';
import Hexo from 'hexo';
import * as hexoPostParser from 'hexo-post-parser';
import { join } from 'upath';
import yaml from 'yaml';
import * as utils from '../utils';
import * as defaults from './defaults';

const configFileJSON = join(__dirname, '_config.json');
if (!fs.existsSync(configFileJSON)) fs.writeFileSync(configFileJSON, '{}');

export interface ProjConf extends Hexo.Config {
  [key: string]: any;
  /**
   * Source posts
   */
  post_dir: string;
  /**
   * Project CWD
   */
  cwd: string;
  /**
   * Deployment options
   */
  deploy: defaults.importConfig['deploy'] & ReturnType<typeof deployConfig>;
  external_link: defaults.importConfig['external_link'] &
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

export function fetchConfig(fileYML: string) {
  if (!fileYML.endsWith('_config.yml')) fileYML += '/_config.yml';
  if (fs.existsSync(fileYML)) {
    const configYML = yaml.parse(fs.readFileSync(fileYML, 'utf-8'));
    setConfig(utils.object.orderKeys(configYML));
    utils.filemanager.writefile(configFileJSON, JSON.stringify(configYML, null, 2));
  }
}

// fetch _config.yml first init
fetchConfig(join(process.cwd(), '_config.yml'));

/**
 * Config setter
 * * useful for jest
 * @param obj
 */
export function setConfig(obj: Record<string, any> | ProjConf) {
  settledConfig = Object.assign(settledConfig || {}, obj);

  // update hexo-post-parser config
  hexoPostParser.setConfig(settledConfig);
  return getConfig();
}

/**
 * Config getter
 * * useful for jest
 * @returns
 */
export function getConfig() {
  settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
  //const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
  return settledConfig as ProjConf;
}

export function deployConfig() {
  const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
  const github = fs.existsSync(deployDir) ? new git(deployDir) : ({ submodule: [] as git[] } as unknown as git);
  return { deployDir, github };
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
