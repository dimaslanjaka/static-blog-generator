import Bluebird from 'bluebird';
import gulp from 'gulp';
export declare function cleanDb(): Promise<void>;
export declare function del(path: string): Bluebird<unknown>;
export declare function cleanOldArchives(done?: gulp.TaskFunctionCallback): Bluebird<void>;
