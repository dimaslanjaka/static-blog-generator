import { postMap } from './post/parsePost';
/**
 * Save Parsed Hexo markdown post
 * @param parsed return {@link parsePost}
 * @param file file path to save
 */
export declare function saveParsedPost(parsed: postMap, file: string): void;
/**
 * validate {@link parsePost}
 * @param parse
 * @returns
 */
export declare const validateParsed: (parse: Partial<postMap>) => boolean;
export declare function nodeListOf2Html(nodes: NodeListOf<Element>): any;
