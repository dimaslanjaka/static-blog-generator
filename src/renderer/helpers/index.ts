import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'upath';
import {
  getAllPosts,
  getLatestPosts,
  getRandomPosts
} from '../../node/cache-post';
import { DynamicObject } from '../../types';
import { cwd, theme_dir } from '../../types/_config';
import * as author from './author';
import * as date from './date';
import * as excerpt from './excerpt';
import { internal_helpers } from './internal-helpers';
import * as keywords from './keywords';
import * as tag from './labels';
import * as locale from './locales';
import * as thumbnail from './thumbnail';

/**
 * layout.ejs from theme_dir
 * @see {@link theme_dir}
 */
export const layout = join(theme_dir, 'layout/layout.ejs');

export const helpers = Object.assign(
  {
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
  },
  author,
  date,
  locale,
  thumbnail,
  keywords,
  excerpt,
  tag,
  internal_helpers
);
export const rendererHelpers = helpers;
