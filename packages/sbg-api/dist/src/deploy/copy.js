'use strict';

var fs = require('fs-extra');
var sbgUtils = require('sbg-utility');

/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
function deployCopy(opt) {
    const defaultConf = sbgUtils.getConfig();
    const config = Object.assign(defaultConf, opt?.config || {});
    return fs.copy(config.public_dir, config.deploy.deployDir, { overwrite: true });
}

exports.deployCopy = deployCopy;
