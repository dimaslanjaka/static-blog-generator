import { existsSync, readFileSync } from 'fs';
import { cwd } from 'process';
import { dirname, join } from 'upath';
import {
  getAllPosts,
  getLatestPosts,
  getRandomPosts
} from '../../node/cache-post';
import { write } from '../../node/filemanager';
import { postMap } from '../../parser/post/parsePost';
import { renderBodyMarkdown } from '../../parser/toHtml';
import { DynamicObject } from '../../types';
import config, { theme_config, theme_dir } from '../../types/_config';
import ejs_object from './index';

const page_url = new URL(config.url);
/**
 * layout.ejs from theme_dir
 * @see {@link theme_dir}
 */
const layout = join(theme_dir, 'layout/layout.ejs');

const helpers = {
  /**
   * get latest posts (non-cache)
   */
  getLatestPosts: getLatestPosts,
  /**
   * get random posts (non-cache)
   */
  getRandomPosts: getRandomPosts,
  /**
   * get all posts (non-cache)
   */
  getAllPosts: getAllPosts,
  /**
   * get all posts (cached)
   */
  getAllCachedPosts: (() => {
    try {
      return getAllPosts().map((parsed) =>
        Object.assign(parsed, parsed.metadata)
      );
    } catch (error) {
      return [];
    }
  })(),
  css: (path: string, attributes: DynamicObject = {}) => {
    const find = {
      cwdFile: join(cwd(), path),
      themeFile: join(theme_dir, path),
      layoutFile: join(dirname(layout), path)
    };
    let cssStr: string;
    for (const key in find) {
      if (Object.prototype.hasOwnProperty.call(find, key)) {
        const cssfile = find[key];
        if (existsSync(cssfile)) {
          cssStr = readFileSync(cssfile, 'utf-8');
          break;
        }
      }
    }
    const build = [];
    for (const key in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        const v = attributes[key];
        build.push(`${key}="${v}"`);
      }
    }
    if (!cssStr) return `<!-- ${path} not found -->`;
    if (!build.length) return `<style>${cssStr}</style>`;
    return `<style ${build.join(' ')}>${cssStr}</style>`;
  }
};

interface Override extends ejs.Options {
  [key: string]: any;
}

/**
 * EJS Renderer Engine
 * @param parsed
 * @param override override {@link Override} object ejs options {@link ejs.Options}, page data {@link postMap} default empty object
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
  override: Override = {}
) {
  if (!parsed) {
    const f = await write(join(__dirname, 'tmp/renderer.json'), parsed);
    if (typeof parsed.body !== 'string' || parsed.body.length === 0) {
      console.log('body empty');
    }
    console.log('dump', f);
    return null;
  }
  // render markdown to html
  let body = '';
  if (parsed.body) body = renderBodyMarkdown(parsed);

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
  ejs_data.page.content = ejs_object.render(body, ejs_data);
  ejs_data.page.body = ejs_data.page.content;
  //write(tmp('tests', 'parse-body.html'), parsed.body).then(console.log);
  //write(tmp('tests', 'generate.log'), inspect(ejs_data)).then(console.log);

  const rendered = await ejs_object.renderFile(layout, ejs_data);
  return rendered;
}
