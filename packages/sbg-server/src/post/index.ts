import debug from 'debug';
import express from 'express';
import * as apis from 'sbg-api';
import { getSourcePosts } from 'sbg-api/dist/post';
import serveIndex from 'serve-index';
import path from 'upath';

const log = debug('sbg').extend('server').extend('route').extend('post');
const router = express.Router();

router.get('/', (_, res) => res.render('post/index.njk'));

export default function routePost(api: apis.Application) {
  const POST_ROOT = path.join(api.cwd, api.config.post_dir);
  log('root<post>', POST_ROOT);
  // list all posts
  router.get('/debug', express.static(POST_ROOT), serveIndex(POST_ROOT, { icons: true }));
  interface PostRequestMiddleware extends express.Request {
    data: (apis.post.ResultSourcePosts & Record<string, any>)[];
  }
  const middleware = async function (req: PostRequestMiddleware, _res: express.Response, next: express.NextFunction) {
    const posts = await getSourcePosts();
    req.data = posts.map((parsed) => Object.assign(parsed, parsed.metadata, { body: parsed.body }));
    next(null);
  };
  router.get('/list', middleware, async function (req: PostRequestMiddleware, res) {
    const data = {
      title: 'Post List',
      section: 'Post',
      // merge metadata
      posts: req.data
    };
    res.render('post/list.njk', data);
  });

  router.get('/edit/:id', middleware, function (req: PostRequestMiddleware, res) {
    const postid = req.params['id'];
    const findPost = req.data.find((post) => post.metadata?.id === postid) || new Error(postid + ' not found');
    if (findPost instanceof Error) return res.json(findPost);
    res.render('post/edit2.html', { post: findPost });
  });

  return router;
}
