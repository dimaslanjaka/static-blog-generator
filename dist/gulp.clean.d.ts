import Bluebird from 'bluebird';
import gulp from 'gulp';
/**
 * Clean Project Databases
 */
export declare function cleanDb(): Promise<void>;
/**
 * delete folder async for gulp
 * @param path
 * @returns
 */
export declare function del(path: string): Bluebird<unknown>;
/**
 * clean old archives (categories, tags, pagination)
 */
export declare function cleanOldArchives(done?: gulp.TaskFunctionCallback): Bluebird<void>;
