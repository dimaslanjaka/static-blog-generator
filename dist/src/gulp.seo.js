"use strict";
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
exports.taskSeo = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var gulp_1 = __importDefault(require("gulp"));
var gulp_dom_1 = __importDefault(require("gulp-dom"));
var gulp_cache_1 = __importDefault(require("./gulp-utils/gulp.cache"));
var gulp_config_1 = require("./gulp.config");
var logger_1 = __importDefault(require("./utils/logger"));
function taskSeo(_done, cwd) {
    var config = (0, gulp_config_1.getConfig)();
    var ignore = Array.isArray(config.exclude) ? config.exclude : [];
    ignore.push.apply(ignore, __spreadArray([], __read(gulp_config_1.commonIgnore), false));
    return gulp_1.default
        .src(['**/*.{htm,html}', '*.{html,htm}'], { cwd: cwd, ignore: ignore })
        .pipe((0, gulp_cache_1.default)({ name: 'seo' }))
        .pipe((0, gulp_dom_1.default)(function (path) {
        var _this = this;
        var images = Array.from(this.querySelectorAll('img[src]'));
        images.forEach(function (el) {
            var alt = el.getAttribute('alt');
            if (!alt || alt.length === 0) {
                var title = _this.title + ' - ' + el.getAttribute('src') || 'No Alt';
                el.setAttribute('alt', title);
            }
        });
        var iframes = Array.from(this.querySelectorAll('iframe[src]'));
        iframes.forEach(function (el) {
            var alt = el.getAttribute('title');
            if (!alt || alt.length === 0) {
                var title = _this.title + ' - ' + el.getAttribute('src') || 'No Title';
                el.setAttribute('title', title);
            }
        });
        var h1 = this.querySelectorAll('h1');
        if (h1.length > 1) {
            logger_1.default.log(ansi_colors_1.default.yellowBright('[WARN]'), "H1 (".concat(h1.length, ") ").concat(path));
        }
    }))
        .pipe(gulp_1.default.dest(cwd));
}
exports.taskSeo = taskSeo;
gulp_1.default.task('seo', function () {
    var deployDir = (0, gulp_config_1.deployConfig)().deployDir;
    return taskSeo(null, deployDir);
});
exports.default = gulp_1.default;
