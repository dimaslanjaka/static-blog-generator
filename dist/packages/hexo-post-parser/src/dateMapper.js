"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = exports.isToday = exports.moment = void 0;
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
var isToday = function (date) { return moment(0, 'HH').diff(date, 'days') == 0; };
exports.isToday = isToday;
var dateMapper = (function () {
    function dateMapper(date) {
        var _this = this;
        this.format = function (pattern) { return _this.data.format(pattern); };
        this.year = function () { return _this.data.format('YYYY'); };
        this.toString = function () { return _this.data.format('YYYY-MM-DDTHH:mm:ssZ'); };
        if (typeof date == 'string' && date.length > 0) {
            if (/\s/.test(date)) {
                try {
                    this.data = moment(date, "".concat(_config_1.default.date_format, " ").concat(_config_1.default.time_format));
                }
                catch (error) {
                    this.data = moment(date, 'YYYY-MM-DD HH:mm:ss');
                }
            }
            else {
                this.data = moment(date);
            }
        }
    }
    return dateMapper;
}());
exports.dateMapper = dateMapper;
