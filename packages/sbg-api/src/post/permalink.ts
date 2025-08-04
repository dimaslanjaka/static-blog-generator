import momentlib from 'moment-timezone';
import { debug, getConfig, normalizePathUnix } from 'sbg-utility';
import path from 'upath';

const moment = (input: momentlib.MomentInput) => {
  momentlib.tz.setDefault(getConfig().timezone || 'UTC');
  return momentlib(input).tz(getConfig().timezone || 'UTC');
};

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
  if (!post) throw new Error('parameter post is ' + typeof post);

  debug('permalink').extend('source')(post);
  const siteConfig = getConfig();
  let pattern = config.permalink_pattern || siteConfig.permalink;
  const date = config.date;
  let cleanPathname = normalizePathUnix(post).replace(/.md$/, '');
  const toReplace = [
    normalizePathUnix(siteConfig.cwd),
    siteConfig.source_dir + '/_posts/',
    `${siteConfig.post_dir || 'src-posts'}/`,
    '_posts/'
  ];
  for (let i = 0; i < toReplace.length; i++) {
    const str = toReplace[i];
    cleanPathname = cleanPathname
      .replace(str, '/')
      // @todo remove multiple slashes
      .replace(/\/+/, '/')
      .replace(/^\/+/, '/');
    // @todo remove .md
    //.replace(/.md$/, '');
  }

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
