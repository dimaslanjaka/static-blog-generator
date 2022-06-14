import { basename, dirname, join } from 'upath';
import { moment } from './dateMapper';
import { postMap } from './types/postMap';
import config from './types/_config';

/**
 * transform permalink format in `_config.yml`
 * @param post
 */
export function parsePermalink(post: postMap) {
  let pattern: string = config.permalink;
  const date = moment(post.metadata.date);
  const replacer = {
    ':month': 'MM',
    ':year': 'YYYY',
    ':day': 'DD',
    ':i_month': 'M',
    ':hour': 'HH',
    ':minute': 'mm',
    ':second': 'ss',
    ':title': basename(post.metadata.url).replace(/.(md|html)$/, ''),
    ':post_title': post.metadata.title
  };
  // @todo [permalink] follow directory path
  if (pattern.startsWith(':title')) {
    const bname = pattern.replace(':title', replacer[':title']);
    const perm = join(dirname(post.metadata.url), bname);
    //console.log(perm);
    return perm;
  }
  for (const date_pattern in replacer) {
    if (Object.prototype.hasOwnProperty.call(replacer, date_pattern)) {
      if (
        [':title', ':post_title', ':id', ':category', ':hash'].includes(
          date_pattern
        )
      ) {
        pattern = pattern.replace(date_pattern, replacer[date_pattern]);
      } else {
        pattern = pattern.replace(
          date_pattern,
          date.format(replacer[date_pattern])
        );
      }
    }
  }
  return pattern;
}
