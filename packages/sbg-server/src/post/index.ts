import express from 'express';
import fm from 'front-matter';
import fs from 'fs-extra';
import glob from 'glob';
import { postMeta } from 'hexo-post-parser';
import * as apis from 'sbg-api';
import serveIndex from 'serve-index';
import path from 'upath';

const router = express.Router();

router.get('/', (_, res) => res.render('post/index.njk'));

export default function routePost(api: apis.Application) {
  const POST_ROOT = path.join(api.cwd, api.config.post_dir);
  console.log('root<post>', POST_ROOT);
  // list all posts
  router.use('/debug', express.static(POST_ROOT), serveIndex(POST_ROOT, { icons: true }));
  router.use('/list', function (_req, res) {
    glob('**/*.md', { cwd: POST_ROOT }, function (err, matches) {
      if (!err) {
        const data = {
          title: 'Post List',
          layout: 'layout.njk',
          posts: matches.map((file) => path.join(POST_ROOT, file)).map((postMd) => FMParse(postMd))
        };
        res.render('post/list.njk', data);
      } else {
        res.send(String(err));
      }
    });
  });

  return router;
}

interface FMResult extends postMeta {
  attributes: postMeta;
  body: string;
  bodyBegin: number;
  frontmatter: string;
}

function FMParse(file: string) {
  if (fs.existsSync(file)) {
    file = fs.readFileSync(file, 'utf-8');
  }
  const result = fm<FMResult>(file);
  return Object.assign(result.attributes, result);
}
