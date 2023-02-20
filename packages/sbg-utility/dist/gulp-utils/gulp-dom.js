'use strict';
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpDom = exports.gulpDomPath = exports.customPath = void 0;
var jsdom_1 = __importDefault(require("jsdom"));
var plugin_error_1 = __importDefault(require("plugin-error"));
var through2_1 = __importDefault(require("through2"));
var true_case_path_1 = __importDefault(require("true-case-path"));
var upath_1 = __importDefault(require("upath"));
var pluginName = 'gulp-dom';
var path = {
    join: function () {
        var str = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            str[_i] = arguments[_i];
        }
        return upath_1.default.toUnix(true_case_path_1.default.trueCasePathSync(upath_1.default.join.apply(upath_1.default, __spreadArray([], __read(str), false))));
    },
    dirname: function (str) { return upath_1.default.toUnix(true_case_path_1.default.trueCasePathSync(upath_1.default.dirname(str))); },
    toUnix: function (str) { return upath_1.default.toUnix(true_case_path_1.default.trueCasePathSync(str)); }
};
exports.customPath = path;
exports.gulpDomPath = path;
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
    var stream = through2_1.default.obj(function (file, _enc, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            return stream.emit('error', new plugin_error_1.default(pluginName, 'Streaming not supported'));
        }
        if (file.isBuffer()) {
            try {
                var dom = new jsdom_1.default.JSDOM(file.contents.toString('utf8'));
                var mutated = mutator.call(dom.window.document, file.path);
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
exports.gulpDom = gulpDom;
exports.default = gulpDom;
//# sourceMappingURL=gulp-dom.js.map