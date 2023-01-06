import { postMap } from './types/postMap';
import { getConfig } from './types/_config';
export interface postAuthor extends Object {
    [key: string]: any;
    name?: string;
    email?: string;
    link?: string;
}
export interface ParseOptions {
    shortcodes?: {
        css: boolean;
        script: boolean;
        include: boolean;
        youtube: boolean;
        link: boolean;
        text: boolean;
        now: boolean;
        codeblock: boolean;
    };
    cache?: boolean;
    sourceFile?: null | string;
    formatDate?: boolean | {
        pattern: string;
    };
    config?: ReturnType<typeof getConfig> & Record<string, any>;
    fix?: boolean;
}
export declare function parsePost(target: string, options?: ParseOptions): Promise<postMap | null>;
export default parsePost;
