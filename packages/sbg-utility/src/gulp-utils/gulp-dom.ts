'use strict';

import jsdom from 'jsdom';
import PluginError from 'plugin-error';
import through2 from 'through2';
import upath from 'upath';
import { Logger } from '../utils';
import { trueCasePathSync } from '../utils/filemanager/path-utility';
const pluginName = 'gulp-dom';
const path = {
  join: (...str: string[]) => upath.toUnix(trueCasePathSync(upath.join(...str))),
  dirname: (str: string) => upath.toUnix(trueCasePathSync(upath.dirname(str))),
  toUnix: (str: string) => upath.toUnix(trueCasePathSync(str))
};

export const customPath = path;
export const gulpDomPath = path;

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
 * @example
 * const gulp = require('gulp');
    gulp.task('html', function() {
        return gulp.src('./src/index.html')
            .pipe(gulpDom(function(){
                return this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
            }))
            .pipe(gulp.dest('./public/'));
    });
 */
export function gulpDom(mutator: GulpDomCallback) {
  const stream = through2.obj(function (file, _enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return stream.emit('error', new PluginError(pluginName, 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      try {
        const dom = new jsdom.JSDOM(file.contents.toString('utf8'));
        const mutated = mutator.call(dom.window.document, file.path);

        file.contents = Buffer.from(typeof mutated === 'string' ? mutated : dom.serialize());
        callback(null, file);

        dom.window.close();
      } catch (e) {
        if (e instanceof Error) {
          Logger.log(e.message);
        }
        Logger.log(pluginName, 'drop file', file.path);
        // drop file
        callback();
      }
    }
  });

  return stream;
}

export default gulpDom;
