import debug from 'debug';
import express from 'express';
import { buildPost } from 'hexo-post-parser';
import moment from 'moment-timezone';
import * as apis from 'sbg-api';
import { getSourcePosts } from 'sbg-api';
import { folder_to_hash, persistentCache, writefile } from 'sbg-utility';
import serveIndex from 'serve-index';
import path from 'upath';
import yaml from 'yaml';
import { expressMiddlewareHandler } from '../helper/express';
import SBGServer from '../server';

const log = debug('sbg').extend('server').extend('route').extend('post');
const router = express.Router();
export const cacheRouterPost = new persistentCache({
  base: path.join(process.cwd(), 'tmp'),
  name: 'sbg-server/post',
  duration: 1000 * 60 * 60 * 24 // 1 day cache
});

export interface PostRequestMiddleware extends express.Request {
  origin_post_data: apis.post.ResultSourcePosts[];
  post_data: (apis.post.ResultSourcePosts &
    apis.post.ResultSourcePosts['metadata'] &
    Record<string, any>)[];
}

export default function routePost(this: SBGServer, api: apis.Application) {
  const POST_ROOT = path.join(api.cwd, api.config.post_dir);
  log('root<post>', POST_ROOT);

  const middleware = async function (
    _req: PostRequestMiddleware,
    _res: express.Response,
    _next: express.NextFunction
  ) {
    //_req.origin_post_data = _req.post_data = [];

    const posts = await getSourcePosts({
      cwd: api.config.cwd,
      post_dir: api.config.post_dir
    }).catch((err) => {
      console.error('get post error', err.message);
      return [] as apis.ResultSourcePosts[];
    });
    // assign to response property
    _req.origin_post_data = posts;
    _req.post_data = posts.map((parsed) =>
      Object.assign(parsed, parsed.metadata, { body: parsed.body })
    );
    _next(null);
  };

  // get checksum all posts
  router.all('/checksum', async function (req, res) {
    const hash = await folder_to_hash(
      'sha256',
      path.join(api.cwd, api.config.post_dir),
      {
        ignored: ['**/node_modules', '**/dist'],
        pattern: '**/*.md',
        encoding: 'base64'
      }
    );
    const current = cacheRouterPost.getSync('checksum', {} as typeof hash);
    if (current !== hash) {
      // req['session']['checksum'] = 'changed';
      cacheRouterPost.setSync('checksum', hash);
    }
    res.json(hash);
  });

  // list all posts
  router.get(
    '/debug',
    express.static(POST_ROOT),
    serveIndex(POST_ROOT, { icons: true })
  );
  router.get(
    '/',
    expressMiddlewareHandler(middleware),
    expressMiddlewareHandler(async function (req: PostRequestMiddleware, res) {
      const data = {
        title: 'Post List',
        section: 'Post',
        // merge metadata
        posts: req.post_data.map((item) => {
          item.relative_source = item.full_source.replace(
            api.config.cwd,
            '<root>'
          );
          if (!item.title) item.title = `No Title - ${item.id}`;
          return item;
        })
      };
      res.render('post/index.njk', data);
    })
  );

  // get all posts json format
  router.get(
    '/json',
    expressMiddlewareHandler(middleware),
    expressMiddlewareHandler(async function (req: PostRequestMiddleware, res) {
      const _data = {
        posts: req.post_data.map((item) => {
          item.relative_source = item.full_source.replace(
            api.config.cwd,
            '<root>'
          );
          if (!item.title) item.title = `No Title - ${item.id}`;
          return item;
        })
      };
      res.json(_data);
    })
  );

  // edit post
  router.get(
    '/edit/:id',
    expressMiddlewareHandler(middleware),
    expressMiddlewareHandler(function (req: PostRequestMiddleware, res) {
      const postid = req.params['id'];
      const findPost =
        req.post_data.find((post) => post.metadata?.id === postid) ||
        new Error(postid + ' not found');
      // show errors
      if (findPost instanceof Error) {
        return res.json({
          error: true,
          message: findPost.message,
          stack: findPost.stack
        });
      }
      const DOMPurify = require('dompurify');
      findPost.rawbody = DOMPurify.sanitize(findPost.rawbody);
      res.render('post/edit2.html', { post: findPost });
    })
  );

  // post saver
  router.post(
    '/save',
    expressMiddlewareHandler(middleware),
    expressMiddlewareHandler(function (req: PostRequestMiddleware, res) {
      const data = req.body;
      const postid = data['id'];
      const findPost =
        req.origin_post_data.find((post) => post.metadata?.id === postid) ||
        new Error(postid + ' not found');
      // show errors
      if (findPost instanceof Error) {
        return res.json({
          error: true,
          message: findPost.message,
          stack: findPost.stack?.split('\n')
        });
      }
      // assign new post body
      if (data.body) findPost.body = data.body;
      // assign new post metadata
      if (data.metadata) findPost.metadata = data.metadata;
      // update post.metadata.updated with timezone on config.timezone
      if (findPost.metadata) {
        findPost.metadata.updated = moment()
          .tz(api.config.timezone || 'UTC')
          .format();
      }
      // rebuild post to markdown
      const build = buildPost(findPost);
      if (typeof build === 'string') {
        [
          path.join(api.config.cwd, 'tmp/post-save', postid + '.md'),
          findPost.full_source
        ].forEach((f) => writefile(f, build));
        res.json({ error: false, message: postid + ' saved successfully' });
      } else {
        res.json({ error: true, message: 'fail to build post ' + postid });
      }
    })
  );

  // post metadata settings
  router.get(
    '/settings/:id',
    expressMiddlewareHandler(middleware),
    expressMiddlewareHandler(function (req: PostRequestMiddleware, res) {
      const postid = req.params['id'];
      const findPost =
        req.post_data.find((post) => post.metadata?.id === postid) ||
        new Error(postid + ' not found');
      if (findPost instanceof Error) return res.json(findPost);
      if (findPost.metadata) {
        if (findPost.metadata.description === findPost.metadata.excerpt) {
          delete findPost.metadata.excerpt;
        }
        if (findPost.metadata.description === findPost.metadata.subtitle) {
          delete findPost.metadata.subtitle;
        }
        if (findPost.metadata.thumbnail === findPost.metadata.cover) {
          delete findPost.metadata.cover;
        }
      }
      // clone meta for edit
      const meta = findPost.metadata;
      // remove meta id and wordcount
      delete meta?.id;
      delete meta?.wordcount;
      // render
      res.render('post/settings.njk', {
        post: findPost,
        metadata: yaml.stringify(meta),
        section: 'Post settings',
        title: 'Post settings'
      });
    })
  );

  return router;
}
