import { existsSync, readFileSync } from 'fs';
import yaml from 'yaml';

/**
 * Generic yaml parser
 * @param target
 * @returns
 */
export function yamlParse<T extends Record<string, unknown>>(
  target: string
): T {
  if (existsSync(target)) return yaml.parse(readFileSync(target).toString());
  return yaml.parse(target);
}
