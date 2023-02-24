import { postAuthor } from 'hexo-post-parser';
import moment from 'moment-timezone';
import nunjucks, { Environment } from 'nunjucks';
/**
 * get post author name
 * @param obj
 * @returns
 */
export declare function getAuthorName(obj: postAuthor): any;
/**
 * Nunjucks environment helper
 * @param paths
 * @param options
 * @returns
 */
export declare function nunjucksEnv(paths: string | string[] | null | undefined, options?: nunjucks.ConfigureOptions): nunjucks.Environment;
export declare function parseDate(input: moment.MomentInput, pattern?: string): string;
/**
 * initiate nunjucks custom function helper
 * @param env
 */
export default function setupNunjuckHelper(env: Environment): void;
