"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var html_minifier_terser_1 = __importDefault(require("html-minifier-terser"));
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var _config_1 = __importDefault(require("../../types/_config"));
var logname = color_1.default['Blue Violet']('[generate]') + color_1.default.Indigo('[minify]');
/**
 * Minify all generated html files
 * @see {@link https://github.com/terser/html-minifier-terser}
 * @param options
 * @param callback
 * @returns
 */
function MinifyHTML(options, callback) {
    var workdir = (0, filemanager_1.join)((0, filemanager_1.cwd)(), _config_1.default.public_dir);
    return (0, filemanager_1.globSrc)('**/*.html', { cwd: workdir })
        .map(function (path) { return (0, filemanager_1.join)(workdir, path); })
        .each(function (file) {
        var content = (0, filemanager_1.read)(file);
        var min = html_minifier_terser_1.default.minify(String(content), options);
        min
            .then(function (minified) {
            (0, filemanager_1.write)(file, minified).then(function (file) { return console.log(logname, file); });
        })
            .catch(console.log);
    })
        .finally(callback);
}
gulp_1.default.task('generate:minify-html', function (done) {
    return MinifyHTML({
        minifyCSS: true,
        minifyJS: true,
        html5: true,
        removeComments: true,
        removeEmptyAttributes: true,
        ignoreCustomComments: [/^!/, /^\s*#/],
        caseSensitive: true
    }, done);
});
gulp_1.default.task('generate:minify', gulp_1.default.series('generate:minify-html'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaWZ5LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvbWluaWZ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLDhFQUEyQztBQUUzQywyREFBcUM7QUFDckMsc0RBQXlFO0FBQ3pFLGdFQUF5QztBQUV6QyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5RTs7Ozs7O0dBTUc7QUFDSCxTQUFTLFVBQVUsQ0FDakIsT0FBeUIsRUFDekIsUUFBeUM7SUFFekMsSUFBTSxPQUFPLEdBQUcsSUFBQSxrQkFBSSxFQUFDLElBQUEsaUJBQUcsR0FBRSxFQUFFLGlCQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsT0FBTyxJQUFBLHFCQUFPLEVBQUMsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDO1NBQzFDLEdBQUcsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUEsa0JBQUksRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQW5CLENBQW1CLENBQUM7U0FDbEMsSUFBSSxDQUFDLFVBQUMsSUFBSTtRQUNULElBQU0sT0FBTyxHQUFHLElBQUEsa0JBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFNLEdBQUcsR0FBRyw4QkFBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckQsR0FBRzthQUNBLElBQUksQ0FBQyxVQUFDLFFBQVE7WUFDYixJQUFBLG1CQUFLLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUM7U0FDRCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUVELGNBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsVUFBQyxJQUFtQjtJQUNwRCxPQUFPLFVBQVUsQ0FDZjtRQUNFLFNBQVMsRUFBRSxJQUFJO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxLQUFLLEVBQUUsSUFBSTtRQUNYLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLHFCQUFxQixFQUFFLElBQUk7UUFDM0Isb0JBQW9CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1FBQ3JDLGFBQWEsRUFBRSxJQUFJO0tBQ3BCLEVBQ0QsSUFBSSxDQUNMLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMifQ==