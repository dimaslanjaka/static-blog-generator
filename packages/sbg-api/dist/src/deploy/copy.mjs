import fs from 'fs-extra';
import { getConfig } from 'sbg-utility';

/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
function deployCopy(opt) {
    const defaultConf = getConfig();
    const config = Object.assign(defaultConf, opt?.config || {});
    return fs.copy(config.public_dir, config.deploy.deployDir, { overwrite: true });
}

export { deployCopy };
