'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsdom = require('jsdom');
var PluginError = require('plugin-error');
var through2 = require('through2');
var path$1 = require('upath');
var casePath = require('../utils/filemanager/case-path.cjs');

const pluginName = 'gulp-dom';
const path = {
    join: (...str) => path$1.toUnix(casePath.trueCasePathSync(path$1.join(...str))),
    dirname: (str) => path$1.toUnix(casePath.trueCasePathSync(path$1.dirname(str))),
    toUnix: (str) => path$1.toUnix(casePath.trueCasePathSync(str))
};
const customPath = path;
const gulpDomPath = path;
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
function gulpDom(mutator) {
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
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
                console.log(pluginName, 'drop file', file.path);
                // drop file
                callback();
            }
        }
    });
    return stream;
}

exports.customPath = customPath;
exports.default = gulpDom;
exports.gulpDom = gulpDom;
exports.gulpDomPath = gulpDomPath;
