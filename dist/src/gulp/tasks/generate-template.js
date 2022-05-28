"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var node_sass_1 = __importDefault(require("node-sass"));
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var color_1 = __importDefault(require("../../node/color"));
var _config_1 = require("../../types/_config");
var logname = color_1.default.hex('#fcba03')('[render template]');
var renderTemplate = function () {
    var src = (0, upath_1.join)(_config_1.theme_dir, 'source/**/**');
    console.log(logname + color_1.default.magentaBright('[template]'), 'copy', src, '->', _config_1.post_generated_dir);
    return gulp_1.default
        .src([src, '!**/.git*'], { cwd: process.cwd() })
        .pipe(through2_1.default.obj(function (file, enc, next) {
        if (file.isNull()) {
            return next(null, file);
        }
        var path = file.path;
        var ext = file.extname;
        if (ext == '.scss') {
            file.extname = '.css';
            var result = node_sass_1.default.renderSync({
                data: String(file.contents)
            });
            file.contents = result.css;
            console.log('[sass]', 'compiled', path);
        }
        next(null, file);
    }))
        .pipe(gulp_1.default.dest(_config_1.post_generated_dir));
    //.on('end', () => console.log(logname + chalk.magentaBright('[template]'), chalk.green('finish')));
};
gulp_1.default.task('generate:template', renderTemplate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtdGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS10ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUF3QjtBQUN4Qix3REFBNkI7QUFDN0Isc0RBQWdDO0FBQ2hDLCtCQUE2QjtBQUM3QiwyREFBcUM7QUFDckMsK0NBQW9FO0FBRXBFLElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUUxRCxJQUFNLGNBQWMsR0FBRztJQUNyQixJQUFNLEdBQUcsR0FBRyxJQUFBLFlBQUksRUFBQyxtQkFBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQ1QsT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQzNDLE1BQU0sRUFDTixHQUFHLEVBQ0gsSUFBSSxFQUNKLDRCQUFrQixDQUNuQixDQUFDO0lBQ0YsT0FBTyxjQUFJO1NBQ1IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1NBQy9DLElBQUksQ0FDSCxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUMzQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDekI7UUFDRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFekIsSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQU0sTUFBTSxHQUFHLG1CQUFJLENBQUMsVUFBVSxDQUFDO2dCQUM3QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN6QztRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQ0g7U0FDQSxJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyw0QkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDdkMsb0dBQW9HO0FBQ3RHLENBQUMsQ0FBQztBQUVGLGNBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUMifQ==