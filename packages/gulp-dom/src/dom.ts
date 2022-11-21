/* eslint-disable @typescript-eslint/triple-slash-reference */
/* jshint node: true, strict: true */

'use strict';

import jsdom from 'jsdom';
import PluginError from 'plugin-error';
import through2 from 'through2';
const pluginName = 'gulp-dom';

type cb = (this: Document, path: string) => any;

/**
 * gulpDom
 * @param mutator callback
 * @returns
 */
export default function gulpDom(this: jsdom.JSDOM, mutator: cb) {
  const stream = through2.obj(function (file, _enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return stream.emit(
        'error',
        new PluginError(pluginName, 'Streaming not supported')
      );
    }

    if (file.isBuffer()) {
      const dom = new jsdom.JSDOM(file.contents.toString('utf8'));
      const mutated = mutator.call(dom.window.document, file.path);

      file.contents = Buffer.from(
        typeof mutated === 'string' ? mutated : dom.serialize()
      );
      callback(null, file);

      dom.window.close();
    }
  });

  return stream;
}
