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
exports.shortcodeScript = void 0;
/* eslint-disable no-useless-escape */
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var upath_1 = require("upath");
var root = (0, upath_1.toUnix)(process.cwd());
var logname = chalk_1.default.blue('[script]');
/**
 * Parse shortcode script
 * ```html
 * <!-- script /path/file.js -->
 * ```
 * @param file markdown file
 * @param str content to replace
 * @returns
 */
function shortcodeScript(file, str) {
    var log = [logname];
    var regex = /<!--\s+?script\s+?(.+?)\s+?-->/gim;
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
                    log[0] += chalk_1.default.greenBright("[".concat(key, "]"));
                    console.log.apply(console, __spreadArray(__spreadArray([], __read(log), false), [file], false));
                    var read_1 = (0, fs_1.readFileSync)(filepath, 'utf-8');
                    str = str.replace(htmlTag, function () { return "<script>".concat(read_1, "</script>"); });
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
exports.shortcodeScript = shortcodeScript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvc2hvcnRjb2Rlcy9zY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxnREFBMEI7QUFDMUIseUJBQThDO0FBQzlDLCtCQUE4QztBQUU5QyxJQUFNLElBQUksR0FBRyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXZDOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLElBQVksRUFBRSxHQUFXO0lBQ3ZELElBQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEIsSUFBTSxLQUFLLEdBQUcsbUNBQW1DLENBQUM7SUFDbEQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7UUFDZCxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sSUFBSSxHQUFHO1lBQ1gsVUFBVSxFQUFFLElBQUEsWUFBSSxFQUFDLElBQUEsZUFBTyxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQztZQUN2RCxvQ0FBb0M7WUFDcEMsUUFBUSxFQUFFLElBQUEsWUFBSSxFQUFDLElBQUksRUFBRSxXQUFXLENBQUM7U0FDbEMsQ0FBQztnQ0FDUyxHQUFHO1lBQ1osSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLElBQUksSUFBQSxlQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFLLENBQUMsV0FBVyxDQUFDLFdBQUksR0FBRyxNQUFHLENBQUMsQ0FBQztvQkFDeEMsT0FBTyxDQUFDLEdBQUcsT0FBWCxPQUFPLHlDQUFRLEdBQUcsWUFBRSxJQUFJLFdBQUU7b0JBQzFCLElBQU0sTUFBSSxHQUFHLElBQUEsaUJBQVksRUFBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsa0JBQVcsTUFBSSxjQUFXLEVBQTFCLENBQTBCLENBQUMsQ0FBQzs7aUJBSTlEO2FBQ0Y7O1FBWkgsS0FBSyxJQUFNLEdBQUcsSUFBSSxJQUFJO2tDQUFYLEdBQUc7OztTQWFiO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUE1QkQsMENBNEJDIn0=