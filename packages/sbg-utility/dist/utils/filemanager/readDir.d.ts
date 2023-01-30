import Bluebird from 'bluebird';
interface readDirDone {
    (err: Error, results?: string[]): any;
}
/**
 * read directory recursive callback
 * @param dir
 * @returns
 */
export declare const readDir: (dir: fs.PathLike, done: readDirDone) => void;
/**
 * read directory recursive async
 * @param dir
 * @returns
 */
export declare const readDirAsync: (dir: fs.PathLike) => Bluebird<string[]>;
export default readDir;
