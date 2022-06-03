import moment from 'moment-timezone';
import { postResult } from '../../../node/cache-post';
import { postMap } from '../../../parser/post/parsePost';
export declare function getLatestDateArray(arr: moment.MomentInput[]): string;
/**
 * Sort post by date descending
 * @param a
 * @param b
 * @returns
 */
export declare function sortByDate(a: postMap, b: postMap, order?: 'desc' | 'asc'): 0 | 1 | -1;
/**
 * get date local
 * @param page
 * @returns
 */
export declare function date_local(page: postResult): string;
/**
 * date format ejs helper
 * @param str
 * @param pattern
 * @returns
 * @example
 * <%- date_format(page.date, 'LLLL') %>
 */
export declare function date_format(str: string | Date | moment.MomentInput, pattern: 'MMMM Do YYYY, h:mm:ss a', page?: postResult): string;
/**
 * check date is valid
 * @param value
 * @returns
 */
export declare const isDate: (value: moment.MomentInput) => boolean;
/**
 * get moment instance of date
 * @param date
 * @param lang
 * @param timezone
 * @returns
 */
export declare function getMoment(date: any, lang: any, timezone: string): moment.Moment;
export declare function toISOString(date: any): string;
export declare function dateHelper(date: any, format: any): string;
export declare function timeHelper(date: any, format: any): string;
export declare function fullDateHelper(date: any, format: any): string;
export declare function relativeDateHelper(date: any): string;
export declare function timeTagHelper(date: any, format: any): string;
export declare function getLanguage(ctx: any): any;
/**
 * Convert Hexo language code to Moment locale code.
 * examples:
 *   default => en
 *   zh-CN => zh-cn
 *
 * Moment defined locales: https://github.com/moment/moment/tree/master/locale
 */
export declare function toMomentLocale(lang: string): string;
