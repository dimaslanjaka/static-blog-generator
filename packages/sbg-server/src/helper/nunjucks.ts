import crypto from 'crypto';
import { postAuthor } from 'hexo-post-parser';
import moment from 'moment-timezone';
import { Environment } from 'nunjucks';

export function getAuthorName(obj: postAuthor) {
  if (!obj) return 'unknown';
  if (obj.name) return obj.name;
  if (obj.nick) return obj.nick;
  if (obj.nickname) return obj.nickname;
  return 'unknown';
}

export function parseDate(input: moment.MomentInput, pattern = 'LLL') {
  return moment(input).format(pattern);
}

export const md5 = (data: string) => crypto.createHash('md5').update(data).digest('hex');

export default function setupNunjuckHelper(env: Environment) {
  env.addGlobal('getAuthorName', getAuthorName);
  env.addGlobal('parseDate', parseDate);
  env.addGlobal('md5', md5);
}
