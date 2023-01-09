import { existsSync, readFileSync } from 'fs';
import git from 'git-command-helper';
import Hexo from 'hexo';
import * as hexoPostParser from 'hexo-post-parser';
import { join } from 'path';
import yaml from 'yaml';
import { getDefaultConfig } from './defaults';
import debug from './utils/debug';
import { writefile } from './utils/fm';
import { orderKeys } from './utils/object';

//typeof import('./_config.json') & Record<string, any> &
export type importConfig = typeof import('./_config.json');

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
  deploy: importConfig['deploy'] & ReturnType<typeof deployConfig>;
  external_link: importConfig['external_link'] &
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

let settledConfig = getDefaultConfig() as Record<string, any>;

const fetched = {};
let fileYML = join(process.cwd(), '_config.yml');
const loadYml = function () {
  if (existsSync(fileYML) && !fetched[fileYML]) {
    fetched[fileYML] = true;
    const configYML = yaml.parse(readFileSync(fileYML, 'utf-8'));
    settledConfig = Object.assign({}, configYML, settledConfig);
    settledConfig = orderKeys(settledConfig);
    // update hexo-post-parser config
    hexoPostParser.setConfig(settledConfig);
    debug('config').extend('changed')(
      new Error().stack
        ?.split(/\r?\n/gm)
        .filter((str) => {
          return !str.includes('node:internal');
        })
        .join('\n')
    );
    writefile(join(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
  }
};

loadYml();

/**
 * Config setter
 * * useful for jest
 * @param obj
 */
export function setConfig(obj: Record<string, any> | ProjConf) {
  settledConfig = Object.assign({}, settledConfig, obj);

  return getConfig();
}

/**
 * Config getter
 * * useful for jest
 * @param customFolder load from custom folder and apply to current config
 * @returns
 */
export function getConfig(customFolder?: string) {
  if (typeof customFolder === 'string') {
    fileYML = join(customFolder, '_config.yml');
    loadYml();
    fetched[fileYML] = true;
  }

  settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
  //const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
  return settledConfig as ProjConf;
}

// first fetch
if (!fetched) getConfig();

export function deployConfig() {
  const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
  const github = existsSync(deployDir) ? new git(deployDir) : null;
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
