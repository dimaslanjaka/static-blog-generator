import path from 'path';
import { getConfig, normalizePath } from 'sbg-utility';

function removeCwd(...paths) {
    const config = getConfig();
    return normalizePath(path.normalize(path.join(...paths)))
        .replace(normalizePath(path.normalize(process.cwd())), '')
        .replace(normalizePath(path.normalize(config.cwd)), '');
}

export { removeCwd };
