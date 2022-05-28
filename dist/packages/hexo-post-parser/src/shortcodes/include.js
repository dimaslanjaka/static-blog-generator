"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortCodeInclude = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var upath_1 = require("upath");
var root = (0, upath_1.toUnix)(process.cwd());
var logname = chalk_1.default.blue('[include]');
/**
 * Process `shortcode include` to included in file, shortcode below:
 * ```html
 * <!-- include file.ext -->
 * ```
 * @param file
 * @param str
 * @returns
 */
function parseShortCodeInclude(file, str) {
    var regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
    var execs = Array.from(str.matchAll(regex));
    if (execs.length) {
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
                        console.log(logname + chalk_1.default.greenBright("[".concat(key, "]")), file);
                        var read_1 = (0, fs_1.readFileSync)(filepath).toString();
                        str = str.replace(htmlTag, function () { return read_1; });
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
    }
    return str;
    /*
    let m: RegExpExecArray;
    const found = false;
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
  
      const allmatch = m[0];
      const bracketmatch = m[1];
  
  
      /*if (existsSync(directFile)) {
        // search from file directory
        console.info(logname + chalk.greenBright('[direct]'), directFile);
        const directRead = readFileSync(directFile).toString();
        str = str.replace(allmatch, directRead);
        found = true;
      } else if (existsSync(cwdFile)) {
        // search from workspace directory
        console.log(logname + chalk.greenBright('[root]'), cwdFile);
        console.info(`${logname} found from direct ${cwdFile}`);
        const rootRead = readFileSync(cwdFile).toString();
        str = str.replace(allmatch, rootRead);
        found = true;
      } else {
        console.error(chalk.redBright('[include][error]'), "couldn't find any file from root", cwdFile);
        console.error(chalk.redBright('[include][error]'), "couldn't find any file from direct", directFile);
        console.log(chalk.redBright('[include][error]'), chalk.magenta('1'), dirname(file.toString()));
        console.log(chalk.redBright('[include][error]'), chalk.magenta('2'), bracketmatch);
        console.log(chalk.redBright('[include][error]'), chalk.magenta('3'), join(dirname(file), bracketmatch));
      }
    }
    // match shortcode and found otherwise repeat
    if (found && str.match(regex)) return parseShortCodeInclude(file, str);
    */
}
exports.parseShortCodeInclude = parseShortCodeInclude;
exports.default = parseShortCodeInclude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5jbHVkZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL3Nob3J0Y29kZXMvaW5jbHVkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBMEI7QUFDMUIseUJBQThDO0FBQzlDLCtCQUE4QztBQUU5QyxJQUFNLElBQUksR0FBRyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXhDOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IscUJBQXFCLENBQUMsSUFBWSxFQUFFLEdBQVc7SUFDN0QsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7SUFDbkQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2hCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO1lBQ2QsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFNLElBQUksR0FBRztnQkFDWCxVQUFVLEVBQUUsSUFBQSxZQUFJLEVBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDO2dCQUN2RCxvQ0FBb0M7Z0JBQ3BDLFFBQVEsRUFBRSxJQUFBLFlBQUksRUFBQyxJQUFJLEVBQUUsV0FBVyxDQUFDO2FBQ2xDLENBQUM7b0NBQ1MsR0FBRztnQkFDWixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ25ELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxJQUFBLGVBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTt3QkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxXQUFJLEdBQUcsTUFBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzNELElBQU0sTUFBSSxHQUFHLElBQUEsaUJBQVksRUFBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDL0MsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSxNQUFJLEVBQUosQ0FBSSxDQUFDLENBQUM7O3FCQUV4QztpQkFDRjs7WUFUSCxLQUFLLElBQU0sR0FBRyxJQUFJLElBQUk7c0NBQVgsR0FBRzs7O2FBVWI7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBQ0QsT0FBTyxHQUFHLENBQUM7SUFFWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bb0NFO0FBQ0osQ0FBQztBQWhFRCxzREFnRUM7QUFDRCxrQkFBZSxxQkFBcUIsQ0FBQyJ9