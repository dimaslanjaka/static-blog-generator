/// <reference types="node" />
import jsdom from 'jsdom';
type cb = (this: Document, path: string) => any;
/**
 * gulpDom
 * @param mutator callback
 * @returns
 */
export default function gulpDom(this: jsdom.JSDOM, mutator: cb): import("stream").Transform;
export {};
