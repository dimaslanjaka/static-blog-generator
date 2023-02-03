/// <reference types="node" />
/// <reference types="node" />
import gulp from 'gulp';
/**
 * Process Safelink on Deploy Dir
 * @param _done callback function
 * @param cwd working directory to scan html's
 * @returns
 */
export declare function taskSafelink(_done?: gulp.TaskFunctionCallback | null | undefined, cwd?: undefined | null | string): NodeJS.ReadWriteStream | import("fs").WriteStream;
