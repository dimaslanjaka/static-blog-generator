/// <reference types="node" />
export type GulpDomCallback = (this: Document, path: string) => any;
/**
 * gulpDom
 * @param mutator callback
 * @returns
 */
export default function gulpDom(mutator: GulpDomCallback): import("stream").Transform;
