import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';

const fileYML = join(process.cwd(), '_config.yml');
let parse: Record<string, any> = {};

if (existsSync(fileYML)) {
  parse = yaml.parse(readFileSync(fileYML, 'utf-8'));
  writeFileSync(join(__dirname, '_config.json'), JSON.stringify(parse));
}

type importConfig = typeof import('./_config.json');
export interface ProjConf extends importConfig {
  [key: string]: any;
}

const ProjectConfig = parse as ProjConf;

export default ProjectConfig;
