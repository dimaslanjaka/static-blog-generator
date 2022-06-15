import { join } from 'upath';
import { inspect } from 'util';
import { write } from '../../node/filemanager';
import { postMap } from '../../parser/post/parsePost';
import { renderBodyMarkdown } from '../../parser/toHtml';
import config, { isDev, theme_config, theme_dir } from '../../types/_config';
import { helpers, layout } from '../helpers';
import ejs_object from './index';

const page_url = new URL(config.url);

interface OverrideEJSOptions extends ejs.Options {
  [key: string]: any;
}

/**
 * EJS Renderer Engine
 * @param parsed
 * @param override override {@link OverrideEJSOptions} object ejs options {@link ejs.Options}, page data {@link postMap} default empty object
 * @returns rendered promise (Promise\<string\>)
 * renderer injection
 * ```js
 * renderer(parsed, {
 *  // new helper available on ejs layout
 *  newhelper: function () {
 *    return 'new helper';
 *  }
 * })
 * ```
 * ejs
 * ```html
 * <%- newhelper() %>
 * ```
 */
export async function EJSRenderer(
  parsed: Partial<postMap>,
  override: OverrideEJSOptions = {}
) {
  if (typeof parsed !== 'object') {
    console.log("'parsed' argument is empty");
    return null;
  } else if (!('posts' in parsed)) {
    // check body only for posts
    if (typeof parsed.body !== 'string' || parsed.body.length === 0) {
      console.log("'parsed.body' is empty");
      return null;
    }
  }

  const defaultOpt: ejs.Options = {
    cache: config.generator.cache
  };

  // assign body
  const pagedata = Object.assign(defaultOpt, parsed.metadata, parsed, override);

  page_url.pathname = parsed['permalink'];
  const ejs_data = Object.assign(
    parsed,
    {
      // page metadata
      page: pagedata,
      // site config
      config: config,
      // layout theme
      root: theme_dir,
      // theme config
      theme: theme_config,
      // permalink
      url: page_url.toString(),
      // content
      content: null
    },
    helpers
  );

  // render body html to ejs compiled
  let body = '';
  body = ejs_object.render(parsed.body, ejs_data);
  // render markdown to html
  if (parsed.body) body = renderBodyMarkdown(parsed);
  // assign body
  ejs_data.page.content = ejs_data.page.body = body;

  if (isDev) {
    write(
      join(__dirname, 'tmp/tests', ejs_data.page.title + '.html'),
      parsed.body
    ).then(console.log);
    write(
      join(__dirname, 'tmp/tests', ejs_data.page.title + '.log'),
      inspect(ejs_data)
    ).then(console.log);
  }

  const rendered = await ejs_object.renderFile(layout, ejs_data);
  return rendered;
}
