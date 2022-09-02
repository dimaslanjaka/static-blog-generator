/// <reference types="node" />

import { JSDOM } from 'jsdom';

declare module 'gulp-dom' {
  export declare function gulpDomCallback(
    this: JSDOM['window']['document']
  ): JSDOM | string;
  function gulpDom(mutator: typeof gulpDomCallback): import('stream').Transform;
  export = gulpDom;
}
