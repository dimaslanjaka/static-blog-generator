import Bluebird from 'bluebird';
import fs from 'fs-extra';

/**
 * delete folder/file async
 * @param path path of file/folder
 * @param throws enable throwable
 * @returns
 */
export function del(path: string, throws?: boolean) {
  return new Bluebird((resolve: (result: void | Error) => any, reject: (why: Error) => any) => {
    const rmOpt: fs.RmOptions = { recursive: true, force: true };
    if (fs.existsSync(path)) {
      if (!throws) {
        // always success
        fs.rm(path, rmOpt).then(resolve).catch(resolve);
      } else {
        fs.rm(path, rmOpt).then(resolve).catch(reject);
      }
      /*if (statSync(path).isDirectory()) {
        rmdir(path, { maxRetries: 10 }).then(resolve).catch(resolve);
      } else {
        rm(path, rmOpt).then(resolve).catch(resolve);
      }*/
    } else {
      if (!throws) {
        // always success
        resolve(new Error(path + ' not found'));
      } else {
        reject(new Error(path + ' not found'));
      }
    }
  });
}
