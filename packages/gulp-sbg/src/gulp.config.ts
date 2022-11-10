import { existsSync, readFileSync, writeFileSync } from 'fs';
import { gitCommandHelper } from 'git-command-helper';
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
}

const ProjectConfig = parse as ProjConf;

export default ProjectConfig;
export function deployConfig() {
  const deployDir = join(process.cwd(), '.deploy_git');
  const config = ProjectConfig;
  const github = new gitCommandHelper(deployDir);
  return { deployDir, config, github };
}
