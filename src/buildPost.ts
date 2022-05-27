import * as yaml from 'yaml';
import { parsePost, postMap } from './parsePost';

/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
export function buildPost(parsed: Partial<postMap>) {
  if (!parsed) {
    throw new Error(
      "'parsed' must be instance of `postMap` object, instead " +
        (parsed === null ? 'null' : typeof parsed)
    );
  }

  if (parsed.metadata)
    return `---\n${yaml.stringify(parsed.metadata)}---\n\n${parsed.body}`;
  return parsed.body;
}

function _dummy() {
  return { parsePost };
}
export default buildPost;
