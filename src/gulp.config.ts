import { existsSync, readFileSync } from 'fs';
import git from 'git-command-helper';
import { join } from 'path';
import yaml from 'yaml';
import { getDefaultConfig } from './defaults';
import { writefile } from './utils/fm';

type importConfig = typeof import('./_config.json') & Record<string, any>;
export interface ProjConf extends importConfig {
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

export const deployDir = join(getConfig().cwd, '.deploy_' + getConfig().deploy?.type || 'git');
export function deployConfig() {
  const config = getConfig().deploy || {};
  const github = new git(deployDir);
  return { deployDir, config, github };
}

let settledConfig = getDefaultConfig() as Record<string, any>;
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
 * @returns
 */
export function getConfig() {
  let fileYML = '';
  if ('cwd' in settledConfig) {
    fileYML = join(settledConfig.cwd, '_config.yml');
  } else {
    fileYML = join(process.cwd(), '_config.yml');
  }
  if (existsSync(fileYML)) {
    const configYML = yaml.parse(readFileSync(fileYML, 'utf-8'));
    settledConfig = Object.assign({}, configYML, settledConfig);
    writefile(join(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
  }
  //const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
  return settledConfig as ProjConf;
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
  '**/.cache/**', // skip common cache folder
  '**/.vscode/**', // skip vscode configuration folder
  '**/.frontmatter/**', // skip frontmatter vscode extension
  '**/pinterest-*.html', // skip pinterest verification file
  '**/_*.standalone.{js,ts}', // skip _filename.standalone.js
  '**/desktop.ini', // windows desktop.ini
  '**/node_modules/**', // node_modules
  '**/.frontmatter/**', // vscode frontmatter plugin
  '**/.git*/**' // any git configs
];
