import Bluebird from 'bluebird';
import gulp from 'gulp';
export declare function cleanDb(callback?: gulp.TaskFunctionCallback | (() => any), files?: string[]): Promise<any>;
export declare function del(path: string): Bluebird<unknown>;
export declare function cleanOldArchives(callback?: gulp.TaskFunctionCallback | (() => any)): Promise<void>;
export declare function cleanGeneratedPosts(callback?: gulp.TaskFunctionCallback | (() => any)): Promise<any>;
