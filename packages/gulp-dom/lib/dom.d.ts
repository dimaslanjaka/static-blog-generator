/// <reference types="node" />
declare type cb = (this: Document) => any;
/**
 * gulpDom
 * @param mutator callback
 * @returns
 */
export default function gulpDom(mutator: cb): import("stream").Transform;
export {};
