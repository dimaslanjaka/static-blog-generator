/// <reference types="node" />
import Bluebird from 'bluebird';
import './clean';
import './gulp.safelink';
export declare function copyGen(): NodeJS.ReadWriteStream;
export declare function asyncCopyGen(): Bluebird<unknown>;
