import * as yaml from 'yaml';
import { parsePost } from './parsePost';
import { postMap } from './types/postMap';

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

  if (parsed.metadata) {
    if ('metadata' in parsed.metadata) {
      delete parsed.metadata.metadata;
    }
    if ('config' in parsed.metadata) {
      delete parsed.metadata.config;
    }
    if ('body' in parsed.metadata) {
      delete parsed.metadata.body;
    }
    if ('content' in parsed.metadata) {
      delete parsed.metadata.content;
    }
    return `---\n${yaml.stringify(parsed.metadata)}---\n\n${parsed.body}`;
  }
  return parsed.body;
}

function _dummy() {
  return { parsePost };
}
export default buildPost;
