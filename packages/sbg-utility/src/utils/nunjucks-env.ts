import { encodeURL } from 'hexo-util';
import nunjucks from 'nunjucks';

export default function envNunjucks() {
  const env = new nunjucks.Environment();
  env.addFilter('uriencode', (str) => {
    return encodeURL(str);
  });
  env.addFilter('noControlChars', (str) => {
    return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
  });
  // Extract date from datetime
  env.addFilter('formatDate', (input: import('moment-timezone').Moment) => {
    return input.toISOString().substring(0, 10);
  });
  return env;
}
