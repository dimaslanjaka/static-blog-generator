import fs from 'fs-extra';
import { getConfig } from 'sbg-utility';
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
  await fs.copy(config.public_dir, config.deploy.deployDir, { overwrite: false, errorOnExist: false });
  await gulpCopyAsync(['**/*.*', '**/.*.*', '**/*'], config.deploy.deployDir, {
    ignore: ['**/.git/**', '**/.gitignore', '**/node_modules/**', '**/tmp/**'],
    cwd: config.public_dir
  });
}
