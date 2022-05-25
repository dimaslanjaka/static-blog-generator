import color from '../node/color';
import {
  dirname,
  existsSync,
  mkdirSync,
  writeFileSync
} from '../node/filemanager';
import { buildPost, postMap } from './post/parsePost';

/**
 * Save Parsed Hexo markdown post
 * @param parsed return {@link parsePost}
 * @param file file path to save
 */
export function saveParsedPost(parsed: postMap, file: string) {
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buildPost(parsed));
}

/**
 * validate {@link parsePost}
 * @param parse
 * @returns
 */
export const validateParsed = (parse: Partial<postMap>) => {
  if (parse === null) return false;
  if (typeof parse === 'undefined') return false;
  if (parse && !parse.body) {
    console.log(color['Red Orange']('body of null:'));
    return false;
  }
  return true;
};

export function nodeListOf2Html(nodes: NodeListOf<Element>) {
  return Array.prototype.reduce.call(
    nodes,
    function (html, node) {
      return html + (node.outerHTML || node.nodeValue);
    },
    ''
  );
}
