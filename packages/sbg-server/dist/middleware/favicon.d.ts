export = favicon;
/**
 * Serves the favicon located by the given `path`.
 *
 * @public
 * @param {String|Buffer} path
 * @param {Object} [options]
 * @return {import('express').Handler} middleware
 */
declare function favicon(path: string | Buffer, options?: any): import('express').Handler;
import Buffer_1 = require("safe-buffer");
import Buffer = Buffer_1.Buffer;
