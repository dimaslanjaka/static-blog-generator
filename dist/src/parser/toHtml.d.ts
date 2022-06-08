import { postMap } from './post/parsePost';
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
export default function renderShowdown(str: string): string;
/**
 * Render markdown to html using `markdown-it`, `markdown-it-attrs`, `markdown-it-anchors`, `markdown-it-sup`, `markdown-it-sub`, `markdown-it-mark`, `markdown-it-footnote`, `markdown-it-abbr`
 * @see {@link https://www.npmjs.com/package/markdown-it-attrs}
 * @see {@link https://www.npmjs.com/package/markdown-it-attrs}
 * @see {@link https://www.npmjs.com/package/markdown-it-anchors}
 * @see {@link https://www.npmjs.com/package/markdown-it-sup}
 * @see {@link https://www.npmjs.com/package/markdown-it-sub}
 * @see {@link https://www.npmjs.com/package/markdown-it-mark}
 * @see {@link https://www.npmjs.com/package/markdown-it-footnote}
 * @see {@link https://www.npmjs.com/package/markdown-it-abbr}
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
export declare function renderBodyMarkdown(parse: Partial<postMap>, verbose?: boolean): string;
