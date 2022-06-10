/// <reference types="node" />
import Stream from 'stream';
import vinyl from 'vinyl';
interface ParsedPath {
    dirname: string;
    basename: string;
    extname: string;
    fullpath: string;
}
interface Options {
    dirname?: string | undefined;
    basename?: string | undefined;
    extname?: string | undefined;
    prefix?: string | undefined;
    suffix?: string | undefined;
}
interface PluginOptions {
    multiExt?: boolean | undefined;
}
/**
 * Gulp rename
 * @param obj
 * @param options
 * @returns NodeJS.ReadWriteStream
 * @see {@link https://www.npmjs.com/package/gulp-rename}
 */
export declare function gulpRename(obj: string | Options | ((path: ParsedPath, file: vinyl.BufferFile) => ParsedPath | void), options?: PluginOptions): Stream.Transform;
export default gulpRename;
