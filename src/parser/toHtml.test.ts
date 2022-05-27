import { join } from '../node/filemanager';
import { root } from '../types/_config';
import { parsePost } from './post/parsePost';
import { renderBodyMarkdown } from './toHtml';

export async function toHtmlTest() {
  const postPath = join(root, 'src-posts', '/Tests/shortcodes.md');
  const parse = await parsePost(postPath);
  const render = renderBodyMarkdown(parse, true);
  return { postPath, parse, render };
}
