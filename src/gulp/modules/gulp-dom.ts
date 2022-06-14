/* jshint node: true, strict: true */
// forked from https://github.com/trygve-lie/gulp-dom/blob/master/lib/dom.js

'use strict';

import jsdom from 'jsdom';
import PluginError from 'plugin-error';
import through2 from 'through2';
import { FunctionType } from '../../parser/utility';
const pluginName = 'gulp-dom';

export function gulpDom(this: Document, mutator: FunctionType) {
  const stream = through2.obj(function (file, enc, callback) {
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
      const mutated = mutator.call(dom.window.document);

      file.contents = Buffer.from(
        typeof mutated === 'string' ? mutated : dom.serialize()
      );
      callback(null, file);

      dom.window.close();
    }
  });

  return stream;
}
