"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeNow = exports.now = void 0;
var _config_1 = __importDefault(require("../types/_config"));
/**
 * Current date time
 * @return string ex> '2012-11-04 14:55:45'
 */
function now() {
    return (new Date()
        //.toISOString()
        .toLocaleString('en-US', {
        timeZone: _config_1.default.timezone
    })
        .replace(/T/, ' ') // replace T with a space
        .replace(/\..+/, '')); // delete the dot and everything after
}
exports.now = now;
/**
 * Transform `now shortcode` to current formatted time
 * ```html
 * <!-- now() -->
 * ```
 * @param file
 * @see {@link now}
 */
function shortcodeNow(file, read) {
    var rex = /<!-- now\(\) -->/gm;
    var matchRegex = read.match(rex);
    if (matchRegex && matchRegex.length > 0) {
        read = read.replace(rex, function () { return now(); });
        //console.log("[shortcode now][" + file.toString().replace(process.cwd(), "") + "] done");
    }
    return read;
}
exports.shortcodeNow = shortcodeNow;
exports.default = shortcodeNow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL3Nob3J0Y29kZXMvdGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw2REFBc0M7QUFFdEM7OztHQUdHO0FBQ0gsU0FBZ0IsR0FBRztJQUNqQixPQUFPLENBQ0wsSUFBSSxJQUFJLEVBQUU7UUFDUixnQkFBZ0I7U0FDZixjQUFjLENBQUMsT0FBTyxFQUFFO1FBQ3ZCLFFBQVEsRUFBRSxpQkFBTSxDQUFDLFFBQVE7S0FDMUIsQ0FBQztTQUNELE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMseUJBQXlCO1NBQzNDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQ3ZCLENBQUMsQ0FBQyxzQ0FBc0M7QUFDM0MsQ0FBQztBQVZELGtCQVVDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLFlBQVksQ0FBQyxJQUEwQixFQUFFLElBQVk7SUFDbkUsSUFBTSxHQUFHLEdBQUcsb0JBQW9CLENBQUM7SUFDakMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN2QyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsY0FBTSxPQUFBLEdBQUcsRUFBRSxFQUFMLENBQUssQ0FBQyxDQUFDO1FBQ3RDLDBGQUEwRjtLQUMzRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELG9DQVFDO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=