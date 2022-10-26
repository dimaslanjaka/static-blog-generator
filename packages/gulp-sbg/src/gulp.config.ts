import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';

const file = join(__dirname, '_config.yml');
const parse = yaml.parse(readFileSync(file, 'utf-8'));
writeFileSync(join(__dirname, '_config.json'), JSON.stringify(parse, null, 2));

type importConfig = typeof import('./_config.json');
export interface ProjConf extends importConfig {
  [key: string]: any;
}

const ProjectConfig = parse as ProjConf;

export default ProjectConfig;
