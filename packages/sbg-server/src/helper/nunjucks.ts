import crypto from 'crypto';
import { postAuthor } from 'hexo-post-parser';
import moment from 'moment-timezone';
import nunjucks, { Environment } from 'nunjucks';

export function getAuthorName(obj: postAuthor) {
  if (!obj) return 'unknown';
  if (typeof obj === 'string') return obj;
  if (obj.name) return obj.name;
  if (obj.nick) return obj.nick;
  if (obj.nickname) return obj.nickname;
  return 'unknown';
}

export function parseDate(input: moment.MomentInput, pattern = 'LLL') {
  return moment(input).format(pattern);
}

export const md5 = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex');

export default function setupNunjuckHelper(env: Environment) {
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
    return new nunjucks.runtime.SafeString(jsonString);
  });
}
