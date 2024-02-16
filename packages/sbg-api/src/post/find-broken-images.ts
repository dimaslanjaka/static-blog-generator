import axios from 'axios';
import Bluebird from 'bluebird';
import { TaskFunctionCallback } from 'gulp';
import Hexo from 'hexo';
import { color } from 'hexo-post-parser';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { getConfig } from 'sbg-utility/dist';

/**
 * find broken images from html
 * @param html html string
 * @returns array of broken image url
 */
export default async function findBrokenImages(html: string, config = getConfig()) {
  const results = [] as string[];
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const images = Array.from(document.querySelectorAll('img'));
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    let imgUrl: string;
    if (img.src && img.src.startsWith('http')) {
      imgUrl = img.src;
    } else {
      imgUrl = config.url + '/' + img.src;
    }
    await axios.get(imgUrl, { maxRedirects: 3 }).catch((e) => {
      console.error(color.default.redBright('broken image'), img.src, e.message);
      results.push(img.src);
    });
  }
  return results;
}

export function hexoFindBrokenImages(done?: TaskFunctionCallback, config = getConfig()) {
  const instance = new Hexo(config.cwd);

  return new Bluebird((resolve) => {
    instance.init().then(() => {
      instance.load().then(() => {
        const postArray = hexo.locals.get('posts').toArray() as Record<string, any>[];
        Bluebird.all(postArray)
          .each(async function (data) {
            if (data && data.body) {
              const html = await marked(data.body, { async: true });
              await findBrokenImages(html);
            }
          })
          .catch((e) => console.error('failed find broken images', e));
        resolve(done);
      });
    });
  });
}
