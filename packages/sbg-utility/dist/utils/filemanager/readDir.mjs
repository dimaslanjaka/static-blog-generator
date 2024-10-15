import Bluebird from 'bluebird';
import fs__default from 'fs-extra';
import path__default from 'upath';

/**
 * read directory recursive callback
 * @param dir
 * @returns
 */
const readDir = function (dir, done) {
    let results = [];
    fs__default.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file)
                return done(undefined, results);
            file = path__default.resolve(dir, file);
            fs__default.stat(file, function (err, stat) {
                if (!err && stat && stat.isDirectory()) {
                    readDir(file, function (err, res) {
                        if (!err && Array.isArray(res))
                            results = results.concat(res);
                        next();
                    });
                }
                else {
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
const readDirAsync = function (dir) {
    return new Bluebird((resolve, reject) => {
        readDir(dir, function (err, files) {
            if (err)
                reject(err);
            resolve(files);
        });
    });
};

export { readDir as default, readDir, readDirAsync };
