import { postAuthor } from 'hexo-post-parser';
import moment from 'moment-timezone';
import { Environment } from 'nunjucks';

export function getAuthorName(obj: postAuthor) {
  if (obj.name) return obj.name;
  if (obj.nick) return obj.nick;
  if (obj.nickname) return obj.nickname;
  return 'unknown';
}

export function parseDate(input: moment.MomentInput, pattern = 'LLL') {
  return moment(input).format(pattern);
}

export default function setupNunjuckHelper(env: Environment) {
  env.addGlobal(getAuthorName.name, getAuthorName);
  env.addGlobal(parseDate.name, parseDate);
}
