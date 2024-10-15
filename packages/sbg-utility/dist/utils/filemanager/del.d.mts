import Bluebird from 'bluebird';
/**
 * delete folder/file async
 * @param path path of file/folder
 * @param throws enable throwable
 * @returns
 */
export declare function del(path: string, throws?: boolean): Bluebird<void | Error>;
