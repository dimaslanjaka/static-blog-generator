import './a_index';
import { buildPost } from './buildPost';
import { parsePost } from './parsePost';

// exports
export { generatePostId } from './generatePostId';
export { renderMarkdownIt as renderMarkdown } from './markdown/toHtml';
export { parsePermalink } from './parsePermalink';
export { DeepPartial, Nullable, ParseOptions } from './parsePost';
export { postMap } from './types/postMap';
export { postMeta } from './types/postMeta';
export { parsePost, buildPost };
// /exports

const hexoPostParser = { parsePost, buildPost, generatePostId, renderMarkdown, parsePermalink, DeepPartial, Nullable, ParseOptions, postMap, postMeta };

export default hexoPostParser;
