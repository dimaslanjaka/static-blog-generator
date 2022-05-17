import * as yaml from 'yaml';
import { parsePost, postMap } from './parsePost';

/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
export function buildPost(parsed: postMap) {
  return `---\n${yaml.stringify(parsed.metadata)}---\n\n${parsed.body}`;
}

function _dummy() {
  return { parsePost };
}
export default buildPost;
