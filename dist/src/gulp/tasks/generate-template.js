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
function generateTemplate() {
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
}
exports.generateTemplate = generateTemplate;
gulp_1.default.task('generate:template', generateTemplate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtdGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS10ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QjtBQUN4Qix3REFBNkI7QUFDN0Isc0RBQWdDO0FBQ2hDLCtCQUFxQztBQUNyQywyREFBcUM7QUFDckMsd0RBQXFEO0FBQ3JELDZEQUk2QjtBQUU3QixJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFMUQsU0FBZ0IsZ0JBQWdCO0lBQzlCLElBQU0sR0FBRyxHQUFHLElBQUEsWUFBSSxFQUFDLG1CQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxPQUFPLEdBQUcsZUFBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsRUFDM0MsTUFBTSxFQUNOLEdBQUcsRUFDSCxJQUFJLEVBQ0osNEJBQWtCLENBQ25CLENBQUM7SUFDRixPQUFPLGNBQUk7U0FDUixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7U0FDL0MsSUFBSSxDQUNILGtCQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN6QjtRQUNELElBQU0sSUFBSSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXpCLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFNLE1BQU0sR0FBRyxtQkFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQzVCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUMzQixPQUFPLENBQUMsR0FBRyxDQUNULGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQ3BCLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBQSx5QkFBVSxFQUFDLElBQUksRUFBRSxDQUFDLElBQUEsYUFBRyxHQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFDL0MsSUFBSSxFQUNKLGVBQUssQ0FBQyxLQUFLLENBQ1QsSUFBQSxZQUFJLEVBQ0YsaUJBQU0sQ0FBQyxVQUFVLEVBQ2pCLElBQUEseUJBQVUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxtQkFBUyxHQUFHLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQzFELFFBQVEsRUFDUixNQUFNLENBQ1AsQ0FDRixDQUNGLENBQ0YsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FDSDtTQUNBLElBQUksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLDRCQUFrQixDQUFDLENBQUMsQ0FBQztJQUN2QyxvR0FBb0c7QUFDdEcsQ0FBQztBQTdDRCw0Q0E2Q0M7QUFFRCxjQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUMifQ==