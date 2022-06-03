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
exports.shortcodeCss = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var upath_1 = require("upath");
var root = (0, upath_1.toUnix)(process.cwd());
var logname = chalk_1.default.blue('[css]');
/**
 * Parse shortcode css
 * ```html
 * <!-- css /path/file.css -->
 * ```
 * @param file file path
 * @param str body content
 * @returns
 */
function shortcodeCss(file, str) {
    var log = [logname];
    var regex = /<!--\s+?css\s+?(.+?)\s+?-->/gim;
    var execs = Array.from(str.matchAll(regex));
    execs.forEach(function (m) {
        var htmlTag = m[0];
        var includefile = m[1];
        var dirs = {
            directFile: (0, upath_1.join)((0, upath_1.dirname)(file.toString()), includefile),
            //cwdFile: join(cwd(), includefile),
            rootFile: (0, upath_1.join)(root, includefile)
        };
        var _loop_1 = function (key) {
            if (Object.prototype.hasOwnProperty.call(dirs, key)) {
                var filepath = dirs[key];
                if ((0, fs_1.existsSync)(filepath)) {
                    console.log.apply(console, __spreadArray(__spreadArray([], __read(log), false), [chalk_1.default.greenBright("[".concat(key, "]")), file], false));
                    var read_1 = (0, fs_1.readFileSync)(filepath, 'utf-8');
                    str = str.replace(htmlTag, function () { return "<style>".concat(read_1, "</style>"); });
                    return "break";
                }
            }
        };
        for (var key in dirs) {
            var state_1 = _loop_1(key);
            if (state_1 === "break")
                break;
        }
    });
    return str;
}
exports.shortcodeCss = shortcodeCss;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvc2hvcnRjb2Rlcy9jc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQix5QkFBOEM7QUFDOUMsK0JBQThDO0FBRTlDLElBQU0sSUFBSSxHQUFHLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFcEM7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixZQUFZLENBQUMsSUFBWSxFQUFFLEdBQVc7SUFDcEQsSUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QixJQUFNLEtBQUssR0FBRyxnQ0FBZ0MsQ0FBQztJQUMvQyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM5QyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQztRQUNkLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxJQUFJLEdBQUc7WUFDWCxVQUFVLEVBQUUsSUFBQSxZQUFJLEVBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDO1lBQ3ZELG9DQUFvQztZQUNwQyxRQUFRLEVBQUUsSUFBQSxZQUFJLEVBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztTQUNsQyxDQUFDO2dDQUNTLEdBQUc7WUFDWixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ25ELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxJQUFBLGVBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtvQkFDeEIsT0FBTyxDQUFDLEdBQUcsT0FBWCxPQUFPLHlDQUFRLEdBQUcsWUFBRSxlQUFLLENBQUMsV0FBVyxDQUFDLFdBQUksR0FBRyxNQUFHLENBQUMsRUFBRSxJQUFJLFdBQUU7b0JBQ3pELElBQU0sTUFBSSxHQUFHLElBQUEsaUJBQVksRUFBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsaUJBQVUsTUFBSSxhQUFVLEVBQXhCLENBQXdCLENBQUMsQ0FBQzs7aUJBSTVEO2FBQ0Y7O1FBWEgsS0FBSyxJQUFNLEdBQUcsSUFBSSxJQUFJO2tDQUFYLEdBQUc7OztTQVliO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUEzQkQsb0NBMkJDIn0=