import fs from 'fs-extra';
import { getConfig } from 'sbg-utility';
export interface deployCopyOptions {
  cwd: string;
  config: ReturnType<typeof getConfig>;
}

/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
export function deployCopy(opt?: deployCopyOptions) {
  let { config } = opt;
  if (!config) config = getConfig();
  return fs.copy(opt.config.public_dir, config.deploy.deployDir, { overwrite: true });
}
