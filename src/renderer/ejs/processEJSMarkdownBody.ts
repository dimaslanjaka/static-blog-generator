import { join } from 'upath';
import { inspect } from 'util';
import { EJSRenderString } from '.';
import { write } from '../../node/filemanager';
import { cleanWhiteSpace } from '../../node/string-utils';
import parsePost, { postMap } from '../../parser/post/parsePost';
import config, { isDev, theme_config, theme_dir } from '../../types/_config';
import { rendererHelpers } from '../helpers';

/**
 * Process EJS shortcode in markdown body
 * @param sourcePost
 * @returns
 */
export async function processEJSMarkdownBody(sourcePost: string | postMap) {
  let parsed: postMap;
  if (typeof sourcePost === 'string') {
    console.log('parse from str');
    parsed = await parsePost(sourcePost, null, { cache: false });
  } else if (!sourcePost) {
    throw new Error(
      'cannot process EJS Markdown Body, parameter "sourcePost" is undefined'
    );
  } else {
    parsed = sourcePost;
  }
  if (isDev)
    write(
      join(
        __dirname,
        'tmp/tests',
        cleanWhiteSpace(parsed.metadata.title, '-') + '-body-plains.md'
      ),
      parsed.body
    ).then(console.log);

  const defaultOpt: ejs.Options = {
    cache: config.generator.cache
  };
  const page_url =
    config.url.replace(/\/+$/, '') +
    '/' +
    parsed.metadata.permalink.replace(/^\/+/, '');
  const data = Object.assign(defaultOpt, {
    page: Object.assign(parsed.metadata, parsed),
    // site config
    config: config,
    // layout theme
    root: theme_dir,
    // theme config
    theme: theme_config,
    // permalink
    url: page_url,
    // content
    content: null,
    body: null,
    rendererHelpers
  });
  // render body markdown to ejs compiled
  if (parsed.body) parsed.body = EJSRenderString(parsed.body, data);
  if (parsed.content) parsed.content = EJSRenderString(parsed.body, data);
  if (isDev) {
    write(
      join(
        __dirname,
        'tmp/tests',
        cleanWhiteSpace(data.page.title, '-') + '-parsed.log'
      ),
      inspect(parsed)
    ).then(console.log);

    write(
      join(
        __dirname,
        'tmp/tests',
        cleanWhiteSpace(data.page.title, '-') + '-body-rendered.md'
      ),
      parsed.body
    ).then(console.log);
  }
  return parsed.body || parsed.content;
}
