import path from 'path';
import { escapeRegex, getConfig, normalizePath } from 'sbg-utility';

/**
 * remove cwd from path for log
 * @param paths
 * @returns
 */
export function removeCwd(...paths: string[]) {
  const config = getConfig();
  return normalizePath(path.normalize(path.join(...paths)))
    .replace(normalizePath(process.cwd()), '')
    .replace(normalizePath(config.cwd), '');
}

/**
 * replace path to post copy destination
 * @param config
 * @param paths
 * @returns
 */
export function replaceCopyDestination(config: ReturnType<typeof getConfig>, ...paths: string[]) {
  const { post_dir = 'src-posts' } = config;
  const generatedPostDir = normalizePath(config.cwd, config.source_dir, '_posts');
  const regex = new RegExp(`[\\/\\\\]${escapeRegex(post_dir)}[\\/\\\\]`);
  const fileWithoutCwd = removeCwd(...paths).replace(regex, '');
  const dest = normalizePath(generatedPostDir, fileWithoutCwd);
  return dest;
}
