'use strict';

var fs = require('fs-extra');
var sbgUtils = require('sbg-utility');
var path = require('upath');
var require$$1 = require('util');

/**
 * Clean Project Databases
 */
async function cleanDb(callback, files) {
    const log = sbgUtils.debug('clean');
    const config = sbgUtils.getConfig();
    if (typeof config.source_dir !== 'string') {
        sbgUtils.writefile(path.join(config.cwd, 'tmp/errors/clean.log'), require$$1.inspect(config));
        throw new Error('config.source_dir must be configured');
    }
    // const publicDir = join(config.cwd, config.public_dir);
    let dirs = [
        path.join(config.cwd, config.source_dir, '_posts'),
        path.join(config.cwd, 'tmp/cache'),
        path.join(config.cwd, 'tmp/dump'),
        path.join(config.cwd, 'tmp/logs'),
        path.join(config.cwd, 'db.json')
    ];
    if (Array.isArray(files))
        dirs = dirs.concat(files);
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        try {
            if (fs.existsSync(dir)) {
                log('cleaning', dir);
                await sbgUtils.del(dir);
            }
        }
        catch {
            log('cannot delete', dir);
        }
    }
    /*const hexo = new hexoLib(config.cwd);
    await hexo.init().catch(noop);
    await hexo.call('clean').catch(noop);*/
    if (typeof callback === 'function')
        return callback();
    return undefined;
}

exports.cleanDb = cleanDb;
