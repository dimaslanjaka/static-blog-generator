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

export const commonIgnore = [
  '**/yandex_*.html',
  '**/comments.html',
  '**/disqus-comments.html',
  '**/comment.html',
  '**/favicon.html',
  '**/404.html',
  '**/node_modules/**',
  '**/tmp/**',
  '**/.cache/**',
  '**/.vscode/**',
  '**/.frontmatter/**',
  '**/pinterest-*.html'
];
