'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpRename = void 0;
// https://www.npmjs.com/package/gulp-rename
var stream_1 = __importDefault(require("stream"));
var upath_1 = require("upath");
/**
 * Gulp rename
 * @param obj
 * @param options
 * @returns NodeJS.ReadWriteStream
 * @see {@link https://www.npmjs.com/package/gulp-rename}
 */
function gulpRename(obj, options) {
    options = options || {};
    var stream = new stream_1.default.Transform({ objectMode: true });
    function parsePath(path, fullpath) {
        var extname = options.multiExt
            ? (0, upath_1.basename)(path).slice((0, upath_1.basename)(path).indexOf('.'))
            : (0, upath_1.extname)(path);
        return {
            dirname: (0, upath_1.dirname)(path),
            basename: (0, upath_1.basename)(path, extname),
            extname: extname,
            fullpath: (0, upath_1.toUnix)(fullpath)
        };
    }
    stream._transform = function (originalFile, unused, callback) {
        var file = originalFile.clone({ contents: false });
        var parsedPath = parsePath(file.relative, originalFile.history[0]);
        var path;
        if (typeof obj === 'string' && obj !== '') {
            path = obj;
        }
        else if (typeof obj === 'function') {
            var newParsedPath = obj(parsedPath, file);
            if (typeof newParsedPath === 'object' && newParsedPath !== null) {
                parsedPath = newParsedPath;
            }
            path = (0, upath_1.join)(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
        }
        else if (typeof obj === 'object') {
            var dirname_1 = 'dirname' in obj ? obj.dirname : parsedPath.dirname, prefix = obj.prefix || '', suffix = obj.suffix || '', basename_1 = 'basename' in obj ? obj.basename : parsedPath.basename, extname = 'extname' in obj ? obj.extname : parsedPath.extname;
            path = (0, upath_1.join)(dirname_1, prefix + basename_1 + suffix + extname);
        }
        else {
            callback(new Error('Unsupported renaming parameter type supplied'), undefined);
            return;
        }
        file.path = (0, upath_1.join)(file.base, path);
        // Rename sourcemap if present
        if (file.sourceMap) {
            file.sourceMap.file = file.relative;
        }
        callback(null, file);
    };
    return stream;
}
exports.gulpRename = gulpRename;
exports.default = gulpRename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuYW1lLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvbW9kdWxlcy9yZW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7QUFDYiw0Q0FBNEM7QUFDNUMsa0RBQTRCO0FBQzVCLCtCQUE0RTtBQXNCNUU7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsVUFBVSxDQUN4QixHQUdxRSxFQUNyRSxPQUF1QjtJQUV2QixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUV4QixJQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFMUQsU0FBUyxTQUFTLENBQUMsSUFBWSxFQUFFLFFBQWlCO1FBQ2hELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRO1lBQzlCLENBQUMsQ0FBQyxJQUFBLGdCQUFRLEVBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUEsZ0JBQVEsRUFBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDLElBQUEsZUFBTyxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxJQUFBLGdCQUFRLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztZQUNqQyxPQUFPLEVBQUUsT0FBTztZQUNoQixRQUFRLEVBQUUsSUFBQSxjQUFNLEVBQUMsUUFBUSxDQUFDO1NBQzNCLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUNsQixZQUE4QixFQUM5QixNQUFNLEVBQ04sUUFBUTtRQUVSLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxJQUFZLENBQUM7UUFFakIsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtZQUN6QyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ1o7YUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFVBQVUsRUFBRTtZQUNwQyxJQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxJQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7Z0JBQy9ELFVBQVUsR0FBRyxhQUFhLENBQUM7YUFDNUI7WUFFRCxJQUFJLEdBQUcsSUFBQSxZQUFJLEVBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMzRTthQUFNLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ2xDLElBQU0sU0FBTyxHQUFHLFNBQVMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQ2pFLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFDekIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxFQUN6QixVQUFRLEdBQUcsVUFBVSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFDakUsT0FBTyxHQUFHLFNBQVMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFFaEUsSUFBSSxHQUFHLElBQUEsWUFBSSxFQUFDLFNBQU8sRUFBRSxNQUFNLEdBQUcsVUFBUSxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQztTQUM1RDthQUFNO1lBQ0wsUUFBUSxDQUNOLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLEVBQ3pELFNBQVMsQ0FDVixDQUFDO1lBQ0YsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFBLFlBQUksRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxDLDhCQUE4QjtRQUM5QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNyQztRQUVELFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXBFRCxnQ0FvRUM7QUFFRCxrQkFBZSxVQUFVLENBQUMifQ==