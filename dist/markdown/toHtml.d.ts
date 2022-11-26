import { postMap } from '../types/postMap';
export declare const converterOpt: {
    strikethrough: boolean;
    tables: boolean;
    tablesHeaderId: boolean;
};
/**
 * Transform markdown string to html string
 * @package showdown
 * @param str
 */
export default function renderShowdown(str: string): any;
/**
 * Render markdown to html using `markdown-it`, `markdown-it-attrs`, `markdown-it-anchors`, `markdown-it-sup`, `markdown-it-sub`, `markdown-it-mark`, `markdown-it-footnote`, `markdown-it-abbr`
 * * {@link https://www.npmjs.com/package/markdown-it-attrs}
 * * {@link https://www.npmjs.com/package/markdown-it-attrs}
 * * {@link https://www.npmjs.com/package/markdown-it-anchors}
 * * {@link https://www.npmjs.com/package/markdown-it-sup}
 * * {@link https://www.npmjs.com/package/markdown-it-sub}
 * * {@link https://www.npmjs.com/package/markdown-it-mark}
 * * {@link https://www.npmjs.com/package/markdown-it-footnote}
 * * {@link https://www.npmjs.com/package/markdown-it-abbr}
 * @param str
 * @returns
 */
export declare function renderMarkdownIt(str: string): string;
/**
 * Fixable render markdown mixed with html
 * * render {@link postMap.body}
 * @todo render markdown to html
 * @param parse
 * @param verbose dump
 * @returns
 */
export declare function renderBodyMarkdown(parse: postMap, verbose?: boolean): string;
