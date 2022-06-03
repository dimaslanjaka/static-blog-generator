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
exports.toMomentLocale = exports.getLanguage = exports.timeTagHelper = exports.relativeDateHelper = exports.fullDateHelper = exports.timeHelper = exports.dateHelper = exports.toISOString = exports.getMoment = exports.isDate = exports.date_format = exports.date_local = exports.sortByDate = exports.getLatestDateArray = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var moment_timezone_1 = __importStar(require("moment-timezone"));
var array_utils_1 = require("../../../node/array-utils");
var color_1 = __importDefault(require("../../../node/color"));
var trace_1 = require("../../../node/trace");
var _config_1 = __importDefault(require("../../../types/_config"));
function getLatestDateArray(arr) {
    arr = (0, array_utils_1.removeEmpties)(arr);
    if (arr.length) {
        var reduce = arr.reduce(function (a, b) { return (a > b ? a : b); });
        return (0, moment_timezone_1.default)(reduce).format('YYYY-MM-DDTHH:mm:ssZ');
    }
}
exports.getLatestDateArray = getLatestDateArray;
/**
 * Sort post by date descending
 * @param a
 * @param b
 * @returns
 */
function sortByDate(a, b, order) {
    if (order === void 0) { order = 'desc'; }
    var dA = a.metadata.updated || a.metadata.date;
    var dB = b.metadata.updated || b.metadata.date;
    if (order == 'desc') {
        if (dA < dB) {
            return 1;
        }
        if (dA > dB) {
            return -1;
        }
    }
    else {
        if (dA > dB) {
            return 1;
        }
        if (dA < dB) {
            return -1;
        }
    }
    return 0;
}
exports.sortByDate = sortByDate;
/**
 * get date local
 * @param page
 * @returns
 */
function date_local(page) {
    if (typeof page == 'object' && page) {
        if (Object.hasOwnProperty.call(page, 'metadata')) {
            var meta = page.metadata;
            if (meta.lang) {
                moment_timezone_1.default.locale(toMomentLocale(meta.lang));
                return toMomentLocale(meta.lang);
            }
            else if (meta.language) {
                moment_timezone_1.default.locale(toMomentLocale(meta.language));
                return toMomentLocale(meta.language);
            }
            else if (_config_1.default.lang) {
                moment_timezone_1.default.locale(toMomentLocale(_config_1.default.lang));
                return toMomentLocale(_config_1.default.lang);
            }
            else if (_config_1.default.language) {
                moment_timezone_1.default.locale(toMomentLocale(_config_1.default.language));
                return toMomentLocale(_config_1.default.language);
            }
        }
    }
    moment_timezone_1.default.locale('en');
    return 'en';
}
exports.date_local = date_local;
/**
 * date format ejs helper
 * @param str
 * @param pattern
 * @returns
 * @example
 * <%- date_format(page.date, 'LLLL') %>
 */
function date_format(str, pattern, page) {
    if (page === void 0) { page = null; }
    if (!str) {
        console.log(color_1.default['Red Orange']('invalid date variable'), 'variable type:', typeof str, (0, trace_1.dumpCaller)(null, { lib: false }));
        return null;
    }
    var imoment = getMoment(str, date_local(page), _config_1.default.timezone);
    return imoment.format(pattern);
}
exports.date_format = date_format;
/**
 * check date is valid
 * @param value
 * @returns
 */
var isDate = function (value) {
    return typeof value === 'object' && value instanceof Date && !isNaN(value.getTime());
};
exports.isDate = isDate;
/**
 * get moment instance of date
 * @param date
 * @param lang
 * @param timezone
 * @returns
 */
function getMoment(date, lang, timezone) {
    var imoment;
    if (date == null)
        imoment = (0, moment_timezone_1.default)();
    if (!(0, moment_timezone_1.isMoment)(date))
        imoment = (0, moment_timezone_1.default)((0, exports.isDate)(date) ? date : new Date(date));
    lang = toMomentLocale(lang);
    if (lang)
        imoment = imoment.locale(lang);
    if (timezone)
        imoment = imoment.tz(timezone);
    return imoment;
}
exports.getMoment = getMoment;
function toISOString(date) {
    if (date == null) {
        return new Date().toISOString();
    }
    if (date instanceof Date || (0, moment_timezone_1.isMoment)(date)) {
        return date.toISOString();
    }
    return new Date(date).toISOString();
}
exports.toISOString = toISOString;
function dateHelper(date, format) {
    var moment = getMoment(date, getLanguage(this), _config_1.default.timezone);
    return moment.format(format || _config_1.default.date_format);
}
exports.dateHelper = dateHelper;
function timeHelper(date, format) {
    var moment = getMoment(date, getLanguage(this), _config_1.default.timezone);
    return moment.format(format || _config_1.default.time_format);
}
exports.timeHelper = timeHelper;
function fullDateHelper(date, format) {
    if (format) {
        var moment_1 = getMoment(date, getLanguage(this), this.config.timezone);
        return moment_1.format(format);
    }
    return "".concat(this.date(date), " ").concat(this.time(date));
}
exports.fullDateHelper = fullDateHelper;
function relativeDateHelper(date) {
    var moment = getMoment(date, getLanguage(this), _config_1.default.timezone);
    return moment.fromNow();
}
exports.relativeDateHelper = relativeDateHelper;
function timeTagHelper(date, format) {
    return "<time datetime=\"".concat(toISOString(date), "\">").concat(this.date(date, format, getLanguage(this), _config_1.default.timezone), "</time>");
}
exports.timeTagHelper = timeTagHelper;
function getLanguage(ctx) {
    return ctx.page.lang || ctx.page.language || ctx.config.language;
}
exports.getLanguage = getLanguage;
/**
 * Convert Hexo language code to Moment locale code.
 * examples:
 *   default => en
 *   zh-CN => zh-cn
 *
 * Moment defined locales: https://github.com/moment/moment/tree/master/locale
 */
function toMomentLocale(lang) {
    if (lang === undefined) {
        return undefined;
    }
    // moment.locale('') equals moment.locale('en')
    // moment.locale(null) equals moment.locale('en')
    if (!lang || lang === 'en' || lang === 'default') {
        return 'en';
    }
    return lang.toLowerCase().replace('_', '-');
}
exports.toMomentLocale = toMomentLocale;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9lanMvaGVscGVyL2RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBc0U7QUFDdEUsaUVBQW1EO0FBQ25ELHlEQUEwRDtBQUUxRCw4REFBd0M7QUFDeEMsNkNBQWlEO0FBRWpELG1FQUE0QztBQUU1QyxTQUFnQixrQkFBa0IsQ0FBQyxHQUF5QjtJQUMxRCxHQUFHLEdBQUcsSUFBQSwyQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNkLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBQSx5QkFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3REO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixVQUFVLENBQ3hCLENBQVUsRUFDVixDQUFVLEVBQ1YsS0FBOEI7SUFBOUIsc0JBQUEsRUFBQSxjQUE4QjtJQUU5QixJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFDbkIsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1gs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