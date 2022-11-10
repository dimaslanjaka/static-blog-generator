import Bluebird from 'bluebird';
import { TaskCallback } from 'undertaker';
/**
 * Clean Project Databases
 */
export declare function cleanDb(): Promise<void>;
/**
 * delete folder async for gulp
 * @param path
 * @returns
 */
export declare function del(path: string): Promise<unknown>;
/**
 * clean old archives (categories, tags, pagination)
 */
export declare function cleanOldArchives(done?: TaskCallback): Bluebird<void>;
