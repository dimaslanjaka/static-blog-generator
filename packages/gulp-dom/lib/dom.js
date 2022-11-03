/* eslint-disable @typescript-eslint/triple-slash-reference */
/* jshint node: true, strict: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsdom_1 = tslib_1.__importDefault(require("jsdom"));
const plugin_error_1 = tslib_1.__importDefault(require("plugin-error"));
const through2_1 = tslib_1.__importDefault(require("through2"));
const pluginName = 'gulp-dom';
/**
 * gulpDom
 * @param mutator callback
 * @returns
 */
function gulpDom(mutator) {
    const stream = through2_1.default.obj(function (file, _enc, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            return stream.emit('error', new plugin_error_1.default(pluginName, 'Streaming not supported'));
        }
        if (file.isBuffer()) {
            const dom = new jsdom_1.default.JSDOM(file.contents.toString('utf8'));
            const mutated = mutator.call(dom.window.document, file.path);
            file.contents = Buffer.from(typeof mutated === 'string' ? mutated : dom.serialize());
            callback(null, file);
            dom.window.close();
        }
    });
    return stream;
}
exports.default = gulpDom;
