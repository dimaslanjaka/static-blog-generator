'use strict';

var Bluebird = require('bluebird');
var fs = require('fs-extra');

/**
 * delete folder/file async
 * @param path path of file/folder
 * @param throws enable throwable
 * @returns
 */
function del(path, throws) {
    return new Bluebird((resolve, reject) => {
        const rmOpt = { recursive: true, force: true };
        if (fs.existsSync(path)) {
            if (!throws) {
                // always success
                fs.rm(path, rmOpt).then(resolve).catch(resolve);
            }
            else {
                fs.rm(path, rmOpt).then(resolve).catch(reject);
            }
            /*if (statSync(path).isDirectory()) {
              rmdir(path, { maxRetries: 10 }).then(resolve).catch(resolve);
            } else {
              rm(path, rmOpt).then(resolve).catch(resolve);
            }*/
        }
        else {
            if (!throws) {
                // always success
                resolve(new Error(path + ' not found'));
            }
            else {
                reject(new Error(path + ' not found'));
            }
        }
    });
}

exports.del = del;
