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
exports.generateTemplate = void 0;
var gulp_1 = __importDefault(require("gulp"));
var node_sass_1 = __importDefault(require("node-sass"));
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var color_1 = __importDefault(require("../../node/color"));
var string_utils_1 = require("../../node/string-utils");
var _config_1 = __importStar(require("../../types/_config"));
var logname = color_1.default.hex('#fcba03')('[render template]');
var generateTemplate = function () {
    var src = (0, upath_1.join)(_config_1.theme_dir, 'source/**/**');
    console.log(logname + color_1.default.magentaBright('[template]'), 'copy', src, '->', _config_1.post_generated_dir);
    return gulp_1.default
        .src([src, '!**/.git*'], { cwd: process.cwd() })
        .pipe(through2_1.default.obj(function (file, enc, next) {
        if (file.isNull()) {
            return next(null, file);
        }
        var path = (0, upath_1.toUnix)(file.path);
        var ext = file.extname;
        if (ext == '.scss') {
            file.extname = '.css';
            var result = node_sass_1.default.renderSync({
                data: String(file.contents)
            });
            file.contents = result.css;
            console.log(color_1.default.pink('[sass]'), color_1.default.Red((0, string_utils_1.replaceArr)(path, [(0, _config_1.cwd)(), /^\//], '')), '->', color_1.default.green((0, upath_1.join)(_config_1.default.public_dir, (0, string_utils_1.replaceArr)(path, [_config_1.theme_dir + '/source', /^\//], '').replace(/.scss$/, '.css'))));
        }
        next(null, file);
    }))
        .pipe(gulp_1.default.dest(_config_1.post_generated_dir));
    //.on('end', () => console.log(logname + chalk.magentaBright('[template]'), chalk.green('finish')));
};
exports.generateTemplate = generateTemplate;
gulp_1.default.task('generate:template', exports.generateTemplate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtdGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS10ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QjtBQUN4Qix3REFBNkI7QUFDN0Isc0RBQWdDO0FBQ2hDLCtCQUFxQztBQUNyQywyREFBcUM7QUFDckMsd0RBQXFEO0FBQ3JELDZEQUk2QjtBQUU3QixJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFbkQsSUFBTSxnQkFBZ0IsR0FBRztJQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFBLFlBQUksRUFBQyxtQkFBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQ1QsT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQzNDLE1BQU0sRUFDTixHQUFHLEVBQ0gsSUFBSSxFQUNKLDRCQUFrQixDQUNuQixDQUFDO0lBQ0YsT0FBTyxjQUFJO1NBQ1IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1NBQy9DLElBQUksQ0FDSCxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUMzQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDekI7UUFDRCxJQUFNLElBQUksR0FBRyxJQUFBLGNBQU0sRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV6QixJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBTSxNQUFNLEdBQUcsbUJBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQzdCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM1QixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FDVCxlQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUNwQixlQUFLLENBQUMsR0FBRyxDQUFDLElBQUEseUJBQVUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQy9DLElBQUksRUFDSixlQUFLLENBQUMsS0FBSyxDQUNULElBQUEsWUFBSSxFQUNGLGlCQUFNLENBQUMsVUFBVSxFQUNqQixJQUFBLHlCQUFVLEVBQUMsSUFBSSxFQUFFLENBQUMsbUJBQVMsR0FBRyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUMxRCxRQUFRLEVBQ1IsTUFBTSxDQUNQLENBQ0YsQ0FDRixDQUNGLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQ0g7U0FDQSxJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyw0QkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDdkMsb0dBQW9HO0FBQ3RHLENBQUMsQ0FBQztBQTdDVyxRQUFBLGdCQUFnQixvQkE2QzNCO0FBRUYsY0FBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSx3QkFBZ0IsQ0FBQyxDQUFDIn0=