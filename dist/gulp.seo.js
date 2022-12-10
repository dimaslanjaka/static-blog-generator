"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSeo = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var gulp_1 = __importDefault(require("gulp"));
var gulp_dom_1 = __importDefault(require("gulp-dom"));
var gulp_config_1 = require("./gulp.config");
var logger_1 = __importDefault(require("./utils/logger"));
var console = logger_1.default;
/**
 * Auto seo runner
 * @param cwd directory to scan htmls
 */
function autoSeo(cwd) {
    return gulp_1.default
        .src(['**/*.{htm,html}', '*.{html,htm}'], { cwd: cwd })
        .pipe((0, gulp_dom_1.default)(function (path) {
        var _this = this;
        // fix alt images
        var images = Array.from(this.querySelectorAll('img[src]'));
        images.forEach(function (el) {
            var alt = el.getAttribute('alt');
            if (!alt || alt.length === 0) {
                var title = _this.title + ' - ' + el.getAttribute('src') || 'No Alt';
                el.setAttribute('alt', title);
            }
        });
        // fix title iframe
        var iframes = Array.from(this.querySelectorAll('iframe[src]'));
        iframes.forEach(function (el) {
            var alt = el.getAttribute('title');
            if (!alt || alt.length === 0) {
                var title = _this.title + ' - ' + el.getAttribute('src') || 'No Title';
                el.setAttribute('title', title);
            }
        });
        // WARNING MAKER
        // count H1
        var h1 = this.querySelectorAll('h1');
        if (h1.length > 1) {
            console.log(ansi_colors_1.default.yellowBright('[WARN]'), "H1 (".concat(h1.length, ") ").concat(path));
        }
    }))
        .pipe(gulp_1.default.dest(cwd));
}
exports.autoSeo = autoSeo;
gulp_1.default.task('seo', function () {
    var deployDir = (0, gulp_config_1.deployConfig)().deployDir;
    return autoSeo(deployDir);
});
exports.default = gulp_1.default;
