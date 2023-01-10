import gulp from 'gulp';
export { default as cleanArchive } from './archive';
export declare function cleanDb(callback?: gulp.TaskFunctionCallback | (() => any), files?: string[]): Promise<any>;
export declare function cleanGeneratedPosts(callback?: gulp.TaskFunctionCallback | (() => any)): Promise<any>;
