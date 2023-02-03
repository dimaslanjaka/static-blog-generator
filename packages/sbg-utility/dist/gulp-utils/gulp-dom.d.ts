/// <reference types="node" />
export declare const customPath: {
    join: (...str: string[]) => string;
    dirname: (str: string) => string;
    toUnix: (str: string) => string;
};
export declare const gulpDomPath: {
    join: (...str: string[]) => string;
    dirname: (str: string) => string;
    toUnix: (str: string) => string;
};
/**
 * Callback/Mutator
 * * this: jsdom
 * * path: current file.path
 */
export type GulpDomCallback = (/** jsdom bind */ this: Document, /** current file path */ path: string) => any;
/**
 * gulp-dom
 * @param mutator callback
 * @returns
 */
export default function gulpDom(mutator: GulpDomCallback): import("stream").Transform;
