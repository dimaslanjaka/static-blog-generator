"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var html_minifier_terser_1 = __importDefault(require("html-minifier-terser"));
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var _config_1 = __importStar(require("../../types/_config"));
var logname = color_1.default['Blue Violet']('[generate]') + color_1.default.Indigo('[minify]');
/**
 * Minify all generated html files
 * @see {@link https://github.com/terser/html-minifier-terser}
 * @param options
 * @param callback
 * @returns
 */
function MinifyHTML(options, callback) {
    var workdir = (0, filemanager_1.join)((0, _config_1.cwd)(), _config_1.default.public_dir);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaWZ5LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvbWluaWZ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIsOEVBQTJDO0FBRTNDLDJEQUFxQztBQUNyQyxzREFBb0U7QUFDcEUsNkRBQWtEO0FBRWxELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlFOzs7Ozs7R0FNRztBQUNILFNBQVMsVUFBVSxDQUNqQixPQUF5QixFQUN6QixRQUF5QztJQUV6QyxJQUFNLE9BQU8sR0FBRyxJQUFBLGtCQUFJLEVBQUMsSUFBQSxhQUFHLEdBQUUsRUFBRSxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sSUFBQSxxQkFBTyxFQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUMxQyxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFBLGtCQUFJLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFuQixDQUFtQixDQUFDO1NBQ2xDLElBQUksQ0FBQyxVQUFDLElBQUk7UUFDVCxJQUFNLE9BQU8sR0FBRyxJQUFBLGtCQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBTSxHQUFHLEdBQUcsOEJBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELEdBQUc7YUFDQSxJQUFJLENBQUMsVUFBQyxRQUFRO1lBQ2IsSUFBQSxtQkFBSyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxjQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLFVBQUMsSUFBbUI7SUFDcEQsT0FBTyxVQUFVLENBQ2Y7UUFDRSxTQUFTLEVBQUUsSUFBSTtRQUNmLFFBQVEsRUFBRSxJQUFJO1FBQ2QsS0FBSyxFQUFFLElBQUk7UUFDWCxjQUFjLEVBQUUsSUFBSTtRQUNwQixxQkFBcUIsRUFBRSxJQUFJO1FBQzNCLG9CQUFvQixFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUNyQyxhQUFhLEVBQUUsSUFBSTtLQUNwQixFQUNELElBQUksQ0FDTCxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDIn0=