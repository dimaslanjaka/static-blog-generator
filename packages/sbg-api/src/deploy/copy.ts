import fs from 'fs-extra';
import { getConfig, normalizePathUnix } from 'sbg-utility';
import { gulpCopyAsync } from '../utils/gulp-utils';

export interface deployCopyOptions {
  cwd: string;
  config: ReturnType<typeof getConfig>;
}

/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
export async function deployCopy(opt?: deployCopyOptions) {
  const defaultConf = getConfig();
  const config = Object.assign(defaultConf, opt?.config || {});
  await fs.copy(config.public_dir, config.deploy.deployDir, { overwrite: true, errorOnExist: false });
  const ignore = ['**/.git/**', '**/.gitignore', '**/node_modules/**', '**/tmp/**'].concat(...config.exclude);
  await gulpCopyAsync(['**/*.*', '**/.*.*', '**/*'], config.deploy.deployDir, {
    ignore,
    cwd: config.public_dir
  });
  // Copy post assets into deploy directory
  const sourcePostDir = normalizePathUnix(config.cwd, config.post_dir);
  // const generatedPostDir = normalizePathUnix(config.cwd, config.source_dir, '_posts');
  await gulpCopyAsync(['**/*.{jpg,png,jpeg,bmp,svg,webp,gif,ico}'], config.deploy.deployDir, {
    ignore,
    cwd: sourcePostDir
  });
}
