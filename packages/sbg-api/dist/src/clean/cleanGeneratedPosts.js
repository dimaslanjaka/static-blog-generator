import { getConfig } from 'sbg-utility';
import path from 'upath';
import { cleanDb } from './cleanDb.js';

/**
 * remove source/_posts
 * @param callback
 * @returns
 */
async function cleanGeneratedPosts(callback) {
    const config = getConfig();
    return cleanDb(callback, [path.join(config.cwd, config.source_dir, '_posts')]);
}

export { cleanGeneratedPosts };
