import debug from 'debug';
import express from 'express';
import fm from 'front-matter';
import fs from 'fs-extra';
import glob from 'glob';
import { postMeta } from 'hexo-post-parser';
import * as apis from 'sbg-api';
import serveIndex from 'serve-index';
import path from 'upath';

const log = debug('sbg').extend('server').extend('route').extend('post');
const router = express.Router();

router.get('/', (_, res) => res.render('post/index.njk'));

export default function routePost(api: apis.Application) {
  const POST_ROOT = path.join(api.cwd, api.config.post_dir);
  log('root<post>', POST_ROOT);
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

interface FMResult extends Required<postMeta> {
  attributes: Required<postMeta>;
  body: string;
  bodyBegin: number;
  frontmatter: string;
}

function FMParse(file: string) {
  let content: string;
  if (fs.existsSync(file)) {
    content = fs.readFileSync(file, 'utf-8');
  } else {
    // file is njk string
    content = file;
  }
  const result = fm<FMResult>(content);
  return Object.assign(
    // assign default property photos
    { photos: [] as string[], wordcount: result.body.replace(/\s+/gim, '').length },
    result.attributes,
    result,
    // assign full path
    { full_source: file }
  );
}
