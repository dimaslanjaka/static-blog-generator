import path from 'path';
import { getConfig, normalizePath } from 'sbg-utility';

export function removeCwd(...paths: string[]) {
  const config = getConfig();
  return normalizePath(path.normalize(path.join(...paths)))
    .replace(normalizePath(path.normalize(process.cwd())), '')
    .replace(normalizePath(path.normalize(config.cwd)), '');
}
