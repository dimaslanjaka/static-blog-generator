import * as momentlib from 'moment-timezone';
import * as path from 'upath';
import debug from '../utils/debug';
import { getConfig } from '../_config';

const moment = (input: momentlib.MomentInput) => momentlib.default(input).tz(getConfig().timezone);

/**
 * transform permalink format in `_config.yml`
 * @param post post path
 */
export function parsePermalink(
  post: string,
  config: {
    [key: string]: any;
    /**
     * permalink pattern
     */
    permalink_pattern: string;
    /**
     * post created date
     */
    date: moment.MomentInput;
    /**
     * post title
     */
    title: string;
  }
) {
  debug('permalink').extend('source')(post);
  let pattern = config.permalink_pattern || getConfig().permalink;
  const date = config.date;
  const cleanPathname = post.replace(/.md$/, '');

  /**
   * @see {@link https://hexo.io/docs/permalinks.html}
   */
  const replacer: Record<string, string> = {
    ':month': 'MM',
    ':year': 'YYYY',
    ':day': 'DD',
    ':i_month': 'M',
    ':hour': 'HH',
    ':minute': 'mm',
    ':second': 'ss',
    // Filename (without pathname)
    ':title': cleanPathname,
    // Filename (relative to “source/_posts/“ folder)
    ':name': path.basename(cleanPathname),
    ':post_title': config.title
  };

  //console.log({ url, curl: config.url });

  // @todo [permalink] follow directory path
  /*if (pattern.startsWith(':title')) {
    const bname = pattern.replace(':title', replacer[':title']);
    const perm = path.join(path.dirname(String(url)), bname);
    debug('permalink')(perm);
    return perm;
  }*/

  for (const date_pattern in replacer) {
    if ([':title', ':post_title', ':id', ':category', ':hash', ':name'].includes(date_pattern)) {
      // direct replace without moment for non-moment-pattern
      pattern = pattern.replace(date_pattern, replacer[date_pattern]);
    } else {
      pattern = pattern.replace(date_pattern, moment(date).format(replacer[date_pattern]));
    }
  }

  // replace %20 to space
  const newPattern = pattern.replace(/%20/g, ' ');
  const result = newPattern.replace(/\/{2,10}/g, '/').replace(config.url, '');

  debug('permalink').extend('result')(result);
  return result;
}
