import { existsSync, readFileSync, writeFileSync } from 'fs';
import git from 'git-command-helper';
import { join } from 'path';
import yaml from 'yaml';

const fileYML = join(process.cwd(), '_config.yml');
let parse: Record<string, any> = {};

if (existsSync(fileYML)) {
  parse = yaml.parse(readFileSync(fileYML, 'utf-8'));
  writeFileSync(join(__dirname, '_config.json'), JSON.stringify(parse, null, 2));
}

type importConfig = typeof import('./_config.json');
export interface ProjConf extends importConfig {
  [key: string]: any;
  /**
   * Source posts
   */
  post_dir: string;
}

const ProjectConfig = Object.assign({ post_dir: 'src-posts' }, parse) as ProjConf;

export default ProjectConfig;
export const deployDir = join(process.cwd(), '.deploy_' + ProjectConfig.deploy?.type || 'git');
export function deployConfig() {
  const config = ProjectConfig.deploy || {};
  const github = new git(deployDir);
  return { deployDir, config, github };
}

/** common ignore files */
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
  '**/_*.standalone.{js,ts}' // skip _filename.standalone.js
];
