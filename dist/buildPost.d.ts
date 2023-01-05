import { postMap } from './types/postMap';
/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
export declare function buildPost(parsed: Partial<postMap>): string;
export default buildPost;
