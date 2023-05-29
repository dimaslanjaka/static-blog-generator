import Bluebird from 'bluebird';
import fs from 'fs-extra';
import path from 'upath';

interface readDirDone {
  (err: Error, results?: string[]): any;
}

/**
 * read directory recursive callback
 * @param dir
 * @returns
 */
export const readDir = function (dir: fs.PathLike, done: readDirDone) {
  let results = [] as string[];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (!err && stat && stat.isDirectory()) {
          readDir(file, function (err, res) {
            if (!err && Array.isArray(res)) results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

/**
 * read directory recursive async
 * @param dir
 * @returns
 */
export const readDirAsync = function (dir: fs.PathLike) {
  return new Bluebird((resolve: (files: string[] | undefined) => any, reject: (err: Error) => any) => {
    readDir(dir, function (err, files) {
      if (err) reject(err);
      resolve(files);
    });
  });
};

export default readDir;
