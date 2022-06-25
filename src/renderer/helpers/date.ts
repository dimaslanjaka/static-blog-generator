/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { default as momentInstance, isMoment, locale } from 'moment-timezone';
import { removeEmpties } from '../../node/array-utils';
import { postResult } from '../../node/cache-post';
import color from '../../node/color';
import { dumpCaller } from '../../node/trace';
import { postMap } from '../../parser/post/parsePost';
import config from '../../types/_config';

export function getLatestDateArray(arr: moment.MomentInput[]) {
  arr = removeEmpties(arr);
  if (arr.length) {
    const reduce = arr.reduce((a, b) => (a > b ? a : b));
    return moment(reduce).format('YYYY-MM-DDTHH:mm:ssZ');
  }
}

/**
 * Sort post by date descending
 * @param a
 * @param b
 * @returns
 */
export function sortByDate(
  a: postMap,
  b: postMap,
  order: 'desc' | 'asc' = 'desc'
) {
  const dA = a.metadata.updated || a.metadata.date;
  const dB = b.metadata.updated || b.metadata.date;
  if (order == 'desc') {
    if (dA < dB) {
      return 1;
    }
    if (dA > dB) {
      return -1;
    }
  } else {
    if (dA > dB) {
      return 1;
    }
    if (dA < dB) {
      return -1;
    }
  }
  return 0;
}

/**
 * get date local
 * @param page
 * @returns
 */
export function date_local(page: postResult) {
  if (typeof page == 'object' && page) {
    if (Object.hasOwnProperty.call(page, 'metadata')) {
      const meta = page.metadata;
      if (meta.lang) {
        locale(toMomentLocale(meta.lang));
        return toMomentLocale(meta.lang);
      } else if (meta.language) {
        locale(toMomentLocale(meta.language));
        return toMomentLocale(meta.language);
      } else if (config.lang) {
        locale(toMomentLocale(config.lang));
        return toMomentLocale(config.lang);
      } else if (config.language) {
        let lang = 'en';
        if (Array.isArray(typeof config.language === 'string')) {
          lang = config.language[0];
        }
        locale(toMomentLocale(lang));
        return toMomentLocale(lang);
      }
    }
  }
  locale('en');
  return 'en';
}

/**
 * date format ejs helper
 * @param str
 * @param pattern
 * @returns
 * @example
 * <%- date_format(page.date, 'LLLL') %>
 */
export function date_format(
  str: string | Date | moment.MomentInput,
  pattern: 'MMMM Do YYYY, h:mm:ss a',
  page: postResult = null
) {
  if (!str) {
    console.log(
      color['Red Orange']('invalid date variable'),
      'variable type:',
      typeof str,
      dumpCaller(null, { lib: false })
    );
    return null;
  }
  const imoment = getMoment(str, date_local(page), config.timezone);
  return imoment.format(pattern);
}

/**
 * check date is valid
 * @param value
 * @returns
 */
export const isDate = (value: moment.MomentInput) =>
  typeof value === 'object' && value instanceof Date && !isNaN(value.getTime());

/**
 * get moment instance of date
 * @param date
 * @param lang
 * @param timezone
 * @returns
 */
export function getMoment(date: any, lang: any, timezone: string) {
  let imoment: moment.Moment;
  if (date == null) imoment = moment();
  if (!isMoment(date)) imoment = moment(isDate(date) ? date : new Date(date));
  lang = toMomentLocale(lang);

  if (lang) imoment = imoment.locale(lang);
  if (timezone) imoment = imoment.tz(timezone);

  return imoment;
}

/**
 * Localized Moment
 * @param date
 * @returns
 */
export function moment(date: any = new Date(), format?: string) {
  let parse = momentInstance(date, format);
  if ('timezone' in config) {
    parse = parse.tz(config.timezone);
  }
  return parse;
}

/**
 * @see {@link moment}
 */
export const modMoment = moment;

export function toISOString(date: string | number | Date) {
  if (date == null) {
    return new Date().toISOString();
  }

  if (date instanceof Date || isMoment(date)) {
    return date.toISOString();
  }

  return new Date(date).toISOString();
}

export function dateHelper(date: string | number | Date, format?: string) {
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.format(format || config.date_format);
}

/**
 * format date time based on `time_format` in `_config.yml`
 * @param date
 * @param format
 * @returns
 */
export function timeHelper(date: string | number | Date, format?: string) {
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.format(format || config.time_format);
}

export function fullDateHelper(date: string | number | Date, format?: string) {
  if (format) {
    const moment = getMoment(date, getLanguage(this), this.config.timezone);
    return moment.format(format);
  }

  return `${this.date(date)} ${this.time(date)}`;
}

export function relativeDateHelper(date) {
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.fromNow();
}

export function timeTagHelper(date, format) {
  return `<time datetime="${toISOString(date)}">${this.date(
    date,
    format,
    getLanguage(this),
    config.timezone
  )}</time>`;
}

export function getLanguage(ctx) {
  return ctx.page.lang || ctx.page.language || ctx.config.language;
}

/**
 * Convert Hexo language code to Moment locale code.
 * examples:
 *   default => en
 *   zh-CN => zh-cn
 *
 * Moment defined locales: https://github.com/moment/moment/tree/master/locale
 */
export function toMomentLocale(lang: string) {
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
