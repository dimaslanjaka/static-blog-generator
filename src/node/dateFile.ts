/**
 * Get information date of files
 */

import * as fs from 'fs';

/**
 * get modified date of file
 * @param path
 * @returns
 */
export function getModifiedDateOfFile(path: fs.PathLike) {
  return new Promise(
    (
      resolve: (obj: {
        mtime: Date;
        ctime: Date;
        'Status Last Modified': Date;
        'Data Last Modified': Date;
      }) => any,
      reject: (err: NodeJS.ErrnoException) => any
    ) => {
      if (!fs.existsSync(path)) throw new Error(path + ' is not exist');

      // fetch file details
      fs.stat(path, (err, stats) => {
        if (err) {
          return reject(err);
        }

        // print file last modified date
        //console.log(`File Data Last Modified: ${stats.mtime}`);
        //console.log(`File Status Last Modified: ${stats.ctime}`);
        const obj = {
          mtime: stats.mtime,
          ctime: stats.ctime,
          'Status Last Modified': stats.ctime,
          'Data Last Modified': stats.mtime
        };
        return resolve(obj);
      });
    }
  );
}
