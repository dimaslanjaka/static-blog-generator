import crypto from 'crypto';
import { postAuthor } from 'hexo-post-parser';
import moment from 'moment-timezone';
import nunjucks, { Environment } from 'nunjucks';

/**
 * get post author name
 * @param obj
 * @returns
 */
export function getAuthorName(obj: postAuthor) {
  if (!obj) return 'unknown';
  if (typeof obj === 'string') return obj;
  if (obj.name) return obj.name;
  if (obj.nick) return obj.nick;
  if (obj.nickname) return obj.nickname;
  return 'unknown';
}

/**
 * Nunjucks environment helper
 * @param paths
 * @param options
 * @returns
 */
export function nunjucksEnv(
  paths: string | string[] | null | undefined,
  options?: nunjucks.ConfigureOptions,
  context?: typeof nunjucks
) {
  const isDev = /dev/i.test(String(process.env.NODE_ENV));
  if (!context) context = nunjucks;
  const defVal: nunjucks.ConfigureOptions = {
    noCache: false,
    autoescape: false,
    web: { useCache: isDev, async: true }
  };
  let env: nunjucks.Environment;
  if (paths) {
    if (typeof options === 'object') {
      env = context.configure(paths, Object.assign(defVal, options));
    } else {
      env = context.configure(paths, defVal);
    }
  }
  if (typeof options === 'object') {
    env = context.configure(Object.assign(defVal, options));
  } else {
    env = context.configure(defVal);
  }

  setupNunjuckHelper(env, context);
  return env;
}

export function parseDate(input: moment.MomentInput, pattern = 'LLL') {
  return moment(input).format(pattern);
}

const md5 = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex');

/**
 * initiate nunjucks custom function helper
 * @param env
 */
export default function setupNunjuckHelper(
  env: Environment,
  context?: typeof nunjucks
) {
  if (!context) context = nunjucks;
  env.addGlobal('getAuthorName', getAuthorName);
  env.addGlobal('parseDate', parseDate);
  env.addGlobal('md5', md5);
  /**
   * Returns a JSON stringified version of the value, safe for inclusion in an
   * inline <script> tag. The optional argument 'spaces' can be used for
   * pretty-printing.
   *
   * Output is NOT safe for inclusion in HTML! If that's what you need, use the
   * built-in 'dump' filter instead.
   * @see {@link https://stackoverflow.com/a/46427070/6404439}
   * @example
   * {{ objectData | json }}
   * {{ objectData | json(2) }}
   */
  env.addFilter('json', function (value, spaces) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const jsonString = JSON.stringify(value, null, spaces).replace(
      /</g,
      '\\u003c'
    );
    return new context.runtime.SafeString(jsonString);
  });
}
