import Bluebird from 'bluebird';
import fs__default from 'fs-extra';

/**
 * delete folder/file async
 * @param path path of file/folder
 * @param throws enable throwable
 * @returns
 */
function del(path, throws) {
    return new Bluebird((resolve, reject) => {
        const rmOpt = { recursive: true, force: true };
        if (fs__default.existsSync(path)) {
            if (!throws) {
                // always success
                fs__default.rm(path, rmOpt).then(resolve).catch(resolve);
            }
            else {
                fs__default.rm(path, rmOpt).then(resolve).catch(reject);
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

export { del };
