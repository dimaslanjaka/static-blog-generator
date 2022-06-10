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
exports.toMomentLocale = exports.getLanguage = exports.timeTagHelper = exports.relativeDateHelper = exports.fullDateHelper = exports.timeHelper = exports.dateHelper = exports.toISOString = exports.modMoment = exports.moment = exports.getMoment = exports.isDate = exports.date_format = exports.date_local = exports.sortByDate = exports.getLatestDateArray = void 0;
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
        return moment(reduce).format('YYYY-MM-DDTHH:mm:ssZ');
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
                (0, moment_timezone_1.locale)(toMomentLocale(meta.lang));
                return toMomentLocale(meta.lang);
            }
            else if (meta.language) {
                (0, moment_timezone_1.locale)(toMomentLocale(meta.language));
                return toMomentLocale(meta.language);
            }
            else if (_config_1.default.lang) {
                (0, moment_timezone_1.locale)(toMomentLocale(_config_1.default.lang));
                return toMomentLocale(_config_1.default.lang);
            }
            else if (_config_1.default.language) {
                (0, moment_timezone_1.locale)(toMomentLocale(_config_1.default.language));
                return toMomentLocale(_config_1.default.language);
            }
        }
    }
    (0, moment_timezone_1.locale)('en');
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
        imoment = moment();
    if (!(0, moment_timezone_1.isMoment)(date))
        imoment = moment((0, exports.isDate)(date) ? date : new Date(date));
    lang = toMomentLocale(lang);
    if (lang)
        imoment = imoment.locale(lang);
    if (timezone)
        imoment = imoment.tz(timezone);
    return imoment;
}
exports.getMoment = getMoment;
/**
 * Localized Moment
 * @param date
 * @returns
 */
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
 * @see {@link moment}
 */
exports.modMoment = moment;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9lanMvaGVscGVyL2RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBc0U7QUFDdEUsaUVBQThFO0FBQzlFLHlEQUEwRDtBQUUxRCw4REFBd0M7QUFDeEMsNkNBQWlEO0FBRWpELG1FQUE0QztBQUU1QyxTQUFnQixrQkFBa0IsQ0FBQyxHQUF5QjtJQUMxRCxHQUFHLEdBQUcsSUFBQSwyQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNkLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3REO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixVQUFVLENBQ3hCLENBQVUsRUFDVixDQUFVLEVBQ1YsS0FBOEI7SUFBOUIsc0JBQUEsRUFBQSxjQUE4QjtJQUU5QixJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFDbkIsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1gsT0FBTyxD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