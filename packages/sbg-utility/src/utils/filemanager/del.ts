import Bluebird from 'bluebird';
import fs from 'fs-extra';

/**
 * delete folder/file async
 * @param path
 * @returns
 */
export function del(path: string) {
  return new Bluebird((resolve) => {
    const rmOpt: fs.RmOptions = { recursive: true, force: true };
    if (fs.existsSync(path)) {
      fs.rm(path, rmOpt).then(resolve).catch(resolve);
      /*if (statSync(path).isDirectory()) {
        rmdir(path, { maxRetries: 10 }).then(resolve).catch(resolve);
      } else {
        rm(path, rmOpt).then(resolve).catch(resolve);
      }*/
    } else {
      resolve(new Error(path + ' not found'));
    }
  });
}
