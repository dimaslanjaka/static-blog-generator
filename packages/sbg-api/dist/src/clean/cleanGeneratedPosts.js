'use strict';

var sbgUtils = require('sbg-utility');
var path = require('upath');
var cleanDb = require('./cleanDb.js');

/**
 * remove source/_posts
 * @param callback
 * @returns
 */
async function cleanGeneratedPosts(callback) {
    const config = sbgUtils.getConfig();
    return cleanDb.cleanDb(callback, [path.join(config.cwd, config.source_dir, '_posts')]);
}

exports.cleanGeneratedPosts = cleanGeneratedPosts;
