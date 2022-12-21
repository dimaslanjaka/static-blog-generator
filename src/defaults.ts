import { readFileSync } from 'fs';
import { join, toUnix } from 'upath';
import yaml from 'yaml';

/**
 * get default configuration
 * @returns
 */
export function getDefaultConfig() {
  const defaultConfig = { post_dir: 'src-posts', cwd: toUnix(process.cwd()) };
  const configYML = yaml.parse(readFileSync(join(__dirname, '_config.yml'), 'utf-8'));
  return Object.assign(defaultConfig, configYML) as typeof import('./_config.json');
}
