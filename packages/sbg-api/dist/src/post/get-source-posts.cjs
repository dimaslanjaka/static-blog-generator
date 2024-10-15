'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var glob = require('glob');
var sbgUtils = require('sbg-utility');
var path = require('upath');
var copy = require('./copy.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var glob__namespace = /*#__PURE__*/_interopNamespaceDefault(glob);

/**
 * get all source markdown posts (_configyml.post_dir)
 * @returns
 */
async function getSourcePosts(config) {
    if (!config)
        config = sbgUtils.getConfig();
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
        const matches = await glob__namespace.glob('**/*.md', { cwd: sourcePostDir, realpath: true, absolute: true });
        // matches = matches.map((p) => path.join(sourcePostDir, p));
        const promises = matches.map((p) => copy.processSinglePost({ file: p, content: null }, function (parsed) {
            results.push(Object.assign(parsed, { full_source: p }));
        }));
        // wait all promises to be resolved
        await Promise.all(promises);
        // write cache
        sbgUtils.writefile(cachePath, sbgUtils.jsonStringifyWithCircularRefs(results));
    }
    return results;
}

exports.default = getSourcePosts;
exports.getSourcePosts = getSourcePosts;
