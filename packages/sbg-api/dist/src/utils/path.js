'use strict';

var path = require('path');
var sbgUtils = require('sbg-utility');

function removeCwd(...paths) {
    const config = sbgUtils.getConfig();
    return sbgUtils.normalizePath(path.normalize(path.join(...paths)))
        .replace(sbgUtils.normalizePath(path.normalize(process.cwd())), '')
        .replace(sbgUtils.normalizePath(path.normalize(config.cwd)), '');
}

exports.removeCwd = removeCwd;
