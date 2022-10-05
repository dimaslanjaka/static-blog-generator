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
var array_utils_1 = require("../../node/array-utils");
var color_1 = __importDefault(require("../../node/color"));
var trace_1 = require("../../node/trace");
var _config_1 = __importDefault(require("../../types/_config"));
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
                var lang = 'en';
                if (Array.isArray(typeof _config_1.default.language === 'string')) {
                    lang = _config_1.default.language[0];
                }
                (0, moment_timezone_1.locale)(toMomentLocale(lang));
                return toMomentLocale(lang);
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
    if ('timezone' in _config_1.default) {
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
/**
 * format date time based on `time_format` in `_config.yml`
 * @param date
 * @param format
 * @returns
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9oZWxwZXJzL2RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBc0U7QUFDdEUsaUVBQThFO0FBQzlFLHNEQUF1RDtBQUV2RCwyREFBcUM7QUFDckMsMENBQThDO0FBRTlDLGdFQUF5QztBQUV6QyxTQUFnQixrQkFBa0IsQ0FBQyxHQUF5QjtJQUMxRCxHQUFHLEdBQUcsSUFBQSwyQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNkLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3REO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixVQUFVLENBQ3hCLENBQVUsRUFDVixDQUFVLEVBQ1YsS0FBOEI7SUFBOUIsc0JBQUEsRUFBQSxjQUE4QjtJQUU5QixJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNqRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFDbkIsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1gsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUNELElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNYLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDtLQUNGO1NBQU07UUFDTCxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDWCxPQUFPLENBQUMsQ0FBQztTQUNWO1FBQ0QsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1gsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNYO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUF2QkQsZ0NBdUJDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxJQUFnQjtJQUN6QyxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7UUFDbkMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDaEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUMzQixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsSUFBQSx3QkFBTSxFQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xDO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDeEIsSUFBQSx3QkFBTSxFQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNLElBQUksaUJBQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3RCLElBQUEsd0JBQU0sRUFBQyxjQUFjLENBQUMsaUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLGNBQWMsQ0FBQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNLElBQUksaUJBQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDaEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8saUJBQU0sQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUU7b0JBQ3RELElBQUksR0FBRyxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0I7Z0JBQ0QsSUFBQSx3QkFBTSxFQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtTQUNGO0tBQ0Y7SUFDRCxJQUFBLHdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDYixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUF6QkQsZ0NBeUJDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLFdBQVcsQ0FDekIsR0FBdUMsRUFDdkMsT0FBa0MsRUFDbEMsSUFBdUI7SUFBdkIscUJBQUEsRUFBQSxXQUF1QjtJQUV2QixJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FDVCxlQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsdUJBQXVCLENBQUMsRUFDNUMsZ0JBQWdCLEVBQ2hCLE9BQU8sR0FBRyxFQUNWLElBQUEsa0JBQVUsRUFBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FDakMsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBaEJELGtDQWdCQztBQUVEOzs7O0dBSUc7QUFDSSxJQUFNLE1BQU0sR0FBRyxVQUFDLEtBQXlCO0lBQzlDLE9BQUEsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQTdFLENBQTZFLENBQUM7QUFEbkUsUUFBQSxNQUFNLFVBQzZEO0FBRWhGOzs7Ozs7R0FNRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxJQUFTLEVBQUUsSUFBUyxFQUFFLFFBQWdCO0lBQzlELElBQUksT0FBc0IsQ0FBQztJQUMzQixJQUFJLElBQUksSUFBSSxJQUFJO1FBQUUsT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxJQUFBLDBCQUFRLEVBQUMsSUFBSSxDQUFDO1FBQUUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFBLGNBQU0sRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVFLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFNUIsSUFBSSxJQUFJO1FBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsSUFBSSxRQUFRO1FBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFN0MsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQVZELDhCQVVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxJQUFzQixFQUFFLE1BQWU7SUFBdkMscUJBQUEsRUFBQSxXQUFnQixJQUFJLEVBQUU7SUFDM0MsSUFBSSxLQUFLLEdBQUcsSUFBQSx5QkFBYyxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxJQUFJLFVBQVUsSUFBSSxpQkFBTSxFQUFFO1FBQ3hCLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFORCx3QkFNQztBQUVEOztHQUVHO0FBQ1UsUUFBQSxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBRWhDLFNBQWdCLFdBQVcsQ0FBQyxJQUE0QjtJQUN0RCxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDaEIsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2pDO0lBRUQsSUFBSSxJQUFJLFlBQVksSUFBSSxJQUFJLElBQUEsMEJBQVEsRUFBQyxJQUFJLENBQUMsRUFBRTtRQUMxQyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUMzQjtJQUVELE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDdEMsQ0FBQztBQVZELGtDQVVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLElBQTRCLEVBQUUsTUFBZTtJQUN0RSxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksaUJBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBSEQsZ0NBR0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxJQUE0QixFQUFFLE1BQWU7SUFDdEUsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsaUJBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLGlCQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUhELGdDQUdDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLElBQTRCLEVBQUUsTUFBZTtJQUMxRSxJQUFJLE1BQU0sRUFBRTtRQUNWLElBQU0sUUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEUsT0FBTyxRQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCO0lBRUQsT0FBTyxVQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0FBQ2pELENBQUM7QUFQRCx3Q0FPQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLElBQUk7SUFDckMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsaUJBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxQixDQUFDO0FBSEQsZ0RBR0M7QUFFRCxTQUFnQixhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU07SUFDeEMsT0FBTywyQkFBbUIsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBSyxJQUFJLENBQUMsSUFBSSxDQUN2RCxJQUFJLEVBQ0osTUFBTSxFQUNOLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFDakIsaUJBQU0sQ0FBQyxRQUFRLENBQ2hCLFlBQVMsQ0FBQztBQUNiLENBQUM7QUFQRCxzQ0FPQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxHQUFHO0lBQzdCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbkUsQ0FBQztBQUZELGtDQUVDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxJQUFZO0lBQ3pDLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELCtDQUErQztJQUMvQyxpREFBaUQ7SUFDakQsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDaEQsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQVhELHdDQVdDIn0=