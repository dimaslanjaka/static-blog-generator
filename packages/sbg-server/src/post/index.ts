import debug from 'debug';
import express from 'express';
import { buildPost } from 'hexo-post-parser';
import * as apis from 'sbg-api';
import { getSourcePosts } from 'sbg-api/dist/post';
import { writefile } from 'sbg-utility/dist/utils/fm';
import serveIndex from 'serve-index';
import path from 'upath';

const log = debug('sbg').extend('server').extend('route').extend('post');
const router = express.Router();

export default function routePost(api: apis.Application) {
  const POST_ROOT = path.join(api.cwd, api.config.post_dir);
  log('root<post>', POST_ROOT);
  // list all posts
  router.get(
    '/debug',
    express.static(POST_ROOT),
    serveIndex(POST_ROOT, { icons: true })
  );
  interface PostRequestMiddleware extends express.Request {
    origin_post_data: apis.post.ResultSourcePosts[];
    post_data: (apis.post.ResultSourcePosts &
      apis.post.ResultSourcePosts['metadata'] &
      Record<string, any>)[];
  }
  const middleware = async function (
    req: PostRequestMiddleware,
    _res: express.Response,
    next: express.NextFunction
  ) {
    const posts = await getSourcePosts();
    req.origin_post_data = posts;
    req.post_data = posts.map((parsed) =>
      Object.assign(parsed, parsed.metadata, { body: parsed.body })
    );
    next(null);
  };
  router.get('/', middleware, async function (req: PostRequestMiddleware, res) {
    const data = {
      title: 'Post List',
      section: 'Post',
      // merge metadata
      posts: req.post_data.map((item) => {
        item.relative_source = item.full_source.replace(
          api.config.cwd,
          '<root>'
        );
        return item;
      })
    };
    res.render('post/index.njk', data);
  });

  router.get(
    '/edit/:id',
    middleware,
    function (req: PostRequestMiddleware, res) {
      const postid = req.params['id'];
      const findPost =
        req.post_data.find((post) => post.metadata?.id === postid) ||
        new Error(postid + ' not found');
      if (findPost instanceof Error) return res.json(findPost);
      res.render('post/edit2.html', { post: findPost });
    }
  );

  router.post('/save', middleware, function (req: PostRequestMiddleware, res) {
    const data = req.body;
    const postid = data['id'];
    const findPost =
      req.origin_post_data.find((post) => post.metadata?.id === postid) ||
      new Error(postid + ' not found');
    if (findPost instanceof Error) return res.json(findPost);
    findPost.body = data.body;
    if (data.metadata) findPost.metadata = data.metadata;
    const build = buildPost(findPost);
    writefile(path.join(__dirname, '../../tmp/post-save.md'), build);
    console.log(findPost.full_source);
    res.setHeader(
      'content-type',
      'text/markdown; charset=UTF-8; variant=CommonMark'
    );
    res.end(build);
  });

  return router;
}
