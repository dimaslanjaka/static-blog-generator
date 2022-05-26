import { join } from '../node/filemanager';
import { root } from '../types/_config';
import { parsePost } from './post/parsePost';
import { renderBodyMarkdown } from './toHtml';

const postPath = join(root, 'src-posts', '/Tests/shortcodes.md');
const parse = parsePost(postPath);
const render = renderBodyMarkdown(parse, true);
export { postPath, parse, render };
