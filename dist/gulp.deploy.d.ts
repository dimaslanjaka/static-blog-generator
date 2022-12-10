/// <reference types="node" />
import Bluebird from 'bluebird';
import './gulp.clean';
import './gulp.safelink';
/**
 * copy generated files (_config_yml.public_dir) to deploy dir (run after generated)
 * @returns
 */
export declare function copyGen(): NodeJS.ReadWriteStream;
/**
 * asynchronous copy generated files (_config_yml.public_dir) to deploy dir (run after generated)
 * @returns
 */
export declare function asyncCopyGen(): Bluebird<unknown>;
