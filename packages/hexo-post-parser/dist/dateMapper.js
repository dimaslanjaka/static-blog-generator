"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = exports.isToday = exports.customMoment = exports.cmoment = exports.moment = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const _config_1 = require("./types/_config");
function moment(date = new Date(), format) {
    try {
        let parse = (0, moment_timezone_1.default)(date, format);
        const config = (0, _config_1.getConfig)();
        if (config.timezone) {
            parse = parse.tz(config.timezone || 'UTC');
        }
        return parse;
    }
    catch (_a) {
        console.log('cannot parse date', String(date));
        return (0, moment_timezone_1.default)();
    }
}
exports.moment = moment;
/**
 * custom moment
 */
exports.cmoment = moment;
exports.customMoment = moment;
/**
 * Moment check date is today
 * @param date
 * @returns
 */
const isToday = (date) => moment(0, 'HH').diff(date, 'days') == 0;
exports.isToday = isToday;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
class dateMapper {
    constructor(date) {
        this.format = (pattern) => this.data.format(pattern);
        this.year = () => this.data.format('YYYY');
        this.toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
        const config = (0, _config_1.getConfig)();
        if (typeof date == 'string' && date.length > 0) {
            if (/\s/.test(date)) {
                // process date for spaced data format
                try {
                    // format di configured pattern
                    this.data = moment(date, `${config.date_format} ${config.time_format}`);
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
}
exports.dateMapper = dateMapper;
//# sourceMappingURL=dateMapper.js.map