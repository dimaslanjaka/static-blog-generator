import { postMap } from '../types/postMap';
export declare const converterOpt: {
    strikethrough: boolean;
    tables: boolean;
    tablesHeaderId: boolean;
};
export default function renderShowdown(str: string): any;
export declare function renderMarkdownIt(str: string): string;
export declare function renderBodyMarkdown(parse: postMap, verbose?: boolean): string;
