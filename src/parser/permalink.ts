import { basename, dirname, join } from 'upath';
import { modMoment } from '../renderer/ejs/helper/date';
import config from '../types/_config';
import { postMap } from './post/parsePost';

/**
 * transform permalink format in `_config.yml`
 * @param post
 */
export function parsePermalink(post: postMap) {
  let pattern: string = config.permalink;
  const date = modMoment(post.metadata.date);
  const replacer = {
    ':month': 'MM',
    ':year': 'YYYY',
    ':day': 'DD',
    ':i_month': 'M',
    ':hour': 'HH',
    ':minute': 'mm',
    ':second': 'ss',
    ':title': basename(post.metadata.permalink).replace(/.(md|html)$/, ''),
    ':post_title': post.metadata.title
  };
  // @todo [permalink] follow directory path
  if (pattern.startsWith(':title')) {
    const bname = pattern.replace(':title', replacer[':title']);
    const perm = join(dirname(post.metadata.permalink), bname);
    //console.log(perm);
    return perm;
  }
  Object.keys(replacer).forEach((date_pattern) => {
    if (pattern.includes(date_pattern))
      pattern = pattern.replace(
        date_pattern,
        date.format(replacer[date_pattern])
      );
  });
  return pattern;
}
