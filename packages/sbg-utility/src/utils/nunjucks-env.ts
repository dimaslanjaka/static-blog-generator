import { encodeURL } from 'hexo-util';
import nunjucks from 'nunjucks';

export function envNunjucks() {
  const env = new nunjucks.Environment();
  env.addFilter('uriencode', (str: string) => {
    return encodeURL(str);
  });
  env.addFilter('noControlChars', (str: string) => {
    return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
  });
  // Extract date from datetime
  env.addFilter('formatDate', (input: import('moment-timezone').Moment) => {
    return input.toISOString().substring(0, 10);
  });
  return env;
}

export default envNunjucks;
