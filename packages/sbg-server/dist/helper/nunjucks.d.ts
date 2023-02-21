import { postAuthor } from 'hexo-post-parser';
import moment from 'moment-timezone';
import { Environment } from 'nunjucks';
export declare function getAuthorName(obj: postAuthor): any;
export declare function parseDate(input: moment.MomentInput, pattern?: string): string;
export default function setupNunjuckHelper(env: Environment): void;
