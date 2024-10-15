import fs from 'fs-extra';
import * as glob from 'glob';
import { getConfig, writefile, jsonStringifyWithCircularRefs } from 'sbg-utility';
import path from 'upath';
import { processSinglePost } from './copy.js';

/**
 * get all source markdown posts (_configyml.post_dir)
 * @returns
 */
async function getSourcePosts(config) {
    if (!config)
        config = getConfig();
    if (!config.cache)
        config.cache = true;
    if (!config.cwd)
        throw new Error('config.cwd is required');
    if (!config.post_dir)
        throw new Error('config.post_dir is required');
    // default cache directory
    if (!config.cacheDirectory)
        config.cacheDirectory = path.join(config.cwd, 'tmp');
    const cachePath = path.join(config.cacheDirectory, 'source-posts.json');
    if (config.cache && (await fs.exists(cachePath))) {
        return JSON.parse(await fs.readFile(cachePath, 'utf-8'));
    }
    const sourcePostDir = path.join(config.cwd, config.post_dir);
    // get cache or empty array
    const results = [];
    if (results.length === 0) {
        const matches = await glob.glob('**/*.md', { cwd: sourcePostDir, realpath: true, absolute: true });
        // matches = matches.map((p) => path.join(sourcePostDir, p));
        const promises = matches.map((p) => processSinglePost({ file: p, content: null }, function (parsed) {
            results.push(Object.assign(parsed, { full_source: p }));
        }));
        // wait all promises to be resolved
        await Promise.all(promises);
        // write cache
        writefile(cachePath, jsonStringifyWithCircularRefs(results));
    }
    return results;
}

export { getSourcePosts as default, getSourcePosts };
