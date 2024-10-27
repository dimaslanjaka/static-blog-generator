import * as glob from 'glob';
import { getConfig } from 'sbg-utility';
import path from 'upath';

export const globalPostIgnore = [
  '**/*.standalone.{cjs,js,mjs,ts}',
  '**/node_modules/**',
  '**/temp/**',
  '**/tmp/**',
  '**/.deploy_*/**',
  '**/*.lock',
  '**/package-lock.json',
  '**/.git/**'
];

export const markdownExtPattern = '{md,markdown,mdown,mkdn,mkd,mdtxt,mdtext,text}';

/**
 * get all source markdown posts (_configyml.post_dir)
 * @returns
 */
export async function getSourcePosts(
  config?: {
    cwd: string;
    post_dir: string;
    cacheDirectory?: string;
    cache?: boolean;
  } & ReturnType<typeof getConfig>
) {
  if (!config) config = getConfig();
  if (!config.cache) config.cache = true;
  if (!config.cwd) throw new Error('config.cwd is required');
  if (!config.post_dir) throw new Error('config.post_dir is required');

  // default cache directory
  if (!config.cacheDirectory) config.cacheDirectory = path.join(config.cwd, 'tmp');

  const sourcePostDir = path.join(config.cwd, config.post_dir);

  const excludes = config.exclude || [];
  return await glob.glob([`**/*.${markdownExtPattern}`, `*.${markdownExtPattern}`, `**/*.${markdownExtPattern}`], {
    ignore: excludes.concat(...globalPostIgnore),
    cwd: sourcePostDir,
    realpath: true,
    absolute: true
    // dot: true,
    // noext: true
  });
}

export default getSourcePosts;

/**
 * get post assets (not markdown)
 * @param config
 */
export async function getSourceAssets(config: ReturnType<typeof getConfig>) {
  const excludes = config.exclude || [];
  const sourcePostDir = path.join(config.cwd, config.post_dir);
  return await glob.glob([`**/*`, `*`, `**/*`], {
    ignore: excludes.concat(
      ...globalPostIgnore,
      `**/*.${markdownExtPattern}`,
      `*.${markdownExtPattern}`,
      `**/*.${markdownExtPattern}`
    ),
    cwd: sourcePostDir,
    realpath: true,
    absolute: true,
    dot: true,
    noext: true
  });
}
