import express from 'express';
import glob from 'glob';
import * as apis from 'sbg-api';
import serveIndex from 'serve-index';
import path from 'upath';

export default function routePost(api: apis.Application) {
  const routePost = express.Router();
  const POST_ROOT = path.join(api.cwd, api.config.post_dir);
  console.log('root<post>', POST_ROOT);
  // list all posts
  routePost.use('/debug', express.static(POST_ROOT), serveIndex(POST_ROOT, { icons: true }));
  routePost.use('/list', function (_req, res) {
    glob('**/*.md', { cwd: POST_ROOT }, function (err, matches) {
      res.setHeader('content-type', 'text/plain');
      if (!err) {
        const data = {
          posts: matches.map((file) => path.join(POST_ROOT, file)).join('\n')
        };
        console.log(matches);
        res.render('list-post.njk', data);
      } else {
        res.send(String(err));
      }
    });
  });

  return routePost;
}
