import nunjucks from 'nunjucks';
import { encodeURL } from './encode-url';

export function envNunjucks(
  loader?: nunjucks.ILoader | nunjucks.ILoader[] | null | undefined,
  opts?: nunjucks.ConfigureOptions | undefined
) {
  const env = new nunjucks.Environment(loader, opts);
  env.addFilter('uriencode', (str: string) => {
    return encodeURL(str);
  });
  env.addFilter('noControlChars', (str: string) => {
    return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
  });
  // Extract date from datetime
  env.addFilter('formatDate', (input: import('moment-timezone').Moment | Date | string) => {
    // Check if input is a Moment instance
    if (input && typeof input === 'object' && 'toISOString' in input && typeof input.toISOString === 'function') {
      return input.toISOString().substring(0, 10);
    }
    // Handle Date instance
    if (input instanceof Date) {
      return input.toISOString().substring(0, 10);
    }
    // Handle string input (try to parse as date)
    if (typeof input === 'string') {
      const date = new Date(input);
      if (!isNaN(date.getTime())) {
        return date.toISOString().substring(0, 10);
      }
    }
    // Fallback: return input as string or empty string
    return String(input || '');
  });
  return env;
}

export default envNunjucks;
