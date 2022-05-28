import { join } from 'upath';
import urlParser from '../../curl/url-parser';
import { arrayAddAll } from '../../node/array-utils';
import CacheFile from '../../node/cache';
import { cwd, globSrc } from '../../node/filemanager';
import jdom from '../../node/jsdom';
import { parsePost } from '../../parser/post/parsePost';
import { EJSRenderer } from '../../renderer/ejs/EJSRenderer';
import config from '../../types/_config';

const images_url: string[] = [];

export default function fix2() {
  const renderCache = new CacheFile('renderArticle');
  //const imgCache = new CacheFile('external-img');
  const dom = new jdom();
  renderCache.getValues().forEach((item) => {
    const parse = dom.parse(item);
    const images = parse.querySelectorAll('img');
    Array.from(images).forEach((el) => {
      let src: string;
      if (el.hasAttribute('src')) {
        src = el.getAttribute('src');
      }
      if (typeof src == 'string') images_url.push(src);
    });
    dom.close();
  });
  const parse = new urlParser(images_url[0]).result;
  console.log(parse);
}

export async function fixExternalImages() {
  /** save directory location */
  const _dest = join(cwd(), config.source_dir, 'images/external');
  const src = join(cwd(), config.source_dir);
  const iterate = globSrc('**/*.{md,html}', { cwd: src }).map((s) =>
    join(src, s)
  );
  iterate.each(async (file) => {
    const isMd = file.endsWith('.md');
    const imageSrc = [];
    if (isMd) {
      const parsed = await parsePost(file);
      if (parsed && Object.hasOwnProperty.call(parsed, 'metadata')) {
        const meta = parsed.metadata;
        if (meta.thumbnail && !imageSrc.includes(meta.thumbnail))
          imageSrc.push(meta.thumbnail);
        if (meta.cover && !imageSrc.includes(meta.cover))
          imageSrc.push(meta.cover);
        if (meta.photos) arrayAddAll(imageSrc, meta.photos);
        /*const body = renderBodyMarkdown(parsed);
        const renderBody = ejs_object.render(body, Object.assign(parsed, parsed.metadata));
        console.log(renderBody.includes('<img'));*/
        const render = await EJSRenderer(parsed);
        console.log(render.includes('<img'));
      }
    }
  });
}
