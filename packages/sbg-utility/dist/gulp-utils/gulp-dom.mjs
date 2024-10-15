import jsdom from 'jsdom';
import PluginError from 'plugin-error';
import through2 from 'through2';
import path__default from 'upath';
import { trueCasePathSync } from '../utils/filemanager/case-path.mjs';

const pluginName = 'gulp-dom';
const path = {
    join: (...str) => path__default.toUnix(trueCasePathSync(path__default.join(...str))),
    dirname: (str) => path__default.toUnix(trueCasePathSync(path__default.dirname(str))),
    toUnix: (str) => path__default.toUnix(trueCasePathSync(str))
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

export { customPath, gulpDom as default, gulpDom, gulpDomPath };
