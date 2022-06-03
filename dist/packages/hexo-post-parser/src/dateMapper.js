"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = exports.moment = void 0;
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var _config_1 = __importDefault(require("./types/_config"));
function moment(date, format) {
    if (date === void 0) { date = new Date(); }
    var parse = (0, moment_timezone_1.default)(date, format);
    if (_config_1.default.timezone) {
        parse = parse.tz(_config_1.default.timezone);
    }
    return parse;
}
exports.moment = moment;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
var dateMapper = /** @class */ (function () {
    function dateMapper(date) {
        var _this = this;
        this.format = function (pattern) { return _this.data.format(pattern); };
        this.year = function () { return _this.data.format('YYYY'); };
        this.toString = function () { return _this.data.format('YYYY-MM-DDTHH:mm:ssZ'); };
        if (typeof date == 'string' && date.length > 0) {
            if (/\s/.test(date)) {
                // process date for spaced data format
                try {
                    // format di configured pattern
                    this.data = moment(date, "".concat(_config_1.default.date_format, " ").concat(_config_1.default.time_format));
                }
                catch (error) {
                    // format with default pattern
                    this.data = moment(date, 'YYYY-MM-DD HH:mm:ss');
                }
            }
            else {
                // format without pattern (RFC)
                this.data = moment(date);
            }
        }
    }
    return dateMapper;
}());
exports.dateMapper = dateMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZU1hcHBlci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL2RhdGVNYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0VBQTREO0FBQzVELDREQUFxQztBQUVyQyxTQUtTLE1BQU0sQ0FBQyxJQUFzQixFQUFFLE1BQWU7SUFBdkMscUJBQUEsRUFBQSxXQUFnQixJQUFJLEVBQUU7SUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBQSx5QkFBYyxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxJQUFJLGlCQUFNLENBQUMsUUFBUSxFQUFFO1FBQ25CLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFYRCx3QkFXQztBQUVEOzs7R0FHRztBQUNIO0lBRUUsb0JBQVksSUFBd0I7UUFBcEMsaUJBbUJDO1FBQ0QsV0FBTSxHQUFHLFVBQUMsT0FBZSxJQUFLLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQXpCLENBQXlCLENBQUM7UUFDeEQsU0FBSSxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQztRQUN0QyxhQUFRLEdBQUcsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEVBQXhDLENBQXdDLENBQUM7UUFyQnhELElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzlDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsc0NBQXNDO2dCQUN0QyxJQUFJO29CQUNGLCtCQUErQjtvQkFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQ2hCLElBQUksRUFDSixVQUFHLGlCQUFNLENBQUMsV0FBVyxjQUFJLGlCQUFNLENBQUMsV0FBVyxDQUFFLENBQzlDLENBQUM7aUJBQ0g7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsOEJBQThCO29CQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUscUJBQXFCLENBQUMsQ0FBQztpQkFDakQ7YUFDRjtpQkFBTTtnQkFDTCwrQkFBK0I7Z0JBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFCO1NBQ0Y7SUFDSCxDQUFDO0lBSUgsaUJBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDO0FBekJZLGdDQUFVIn0=