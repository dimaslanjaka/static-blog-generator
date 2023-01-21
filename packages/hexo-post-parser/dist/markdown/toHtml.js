"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBodyMarkdown = exports.renderMarkdownIt = exports.converterOpt = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_abbr_1 = __importDefault(require("markdown-it-abbr"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const showdown_1 = __importDefault(require("showdown"));
const filemanager_1 = require("../node/filemanager");
const index_1 = __importDefault(require("../node/slugify/index"));
exports.converterOpt = {
    strikethrough: true,
    tables: true,
    tablesHeaderId: true
};
/**
 * Transform markdown string to html string
 * @package showdown
 * @param str
 */
function renderShowdown(str) {
    const converter = new showdown_1.default.Converter(exports.converterOpt);
    return converter.makeHtml(str);
}
exports.default = renderShowdown;
const md = new markdown_it_1.default({
    html: true,
    // Autoconvert URL-like text to links
    linkify: false,
    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer: true,
    breaks: false,
    langPrefix: 'language-' // CSS language prefix for fenced blocks. Can be useful for external highlighters.
});
//md.linkify.set({ fuzzyEmail: false }); // disables converting email to link
md.use(markdown_it_sup_1.default)
    .use(markdown_it_sub_1.default)
    .use(markdown_it_mark_1.default)
    .use(markdown_it_abbr_1.default)
    .use(markdown_it_footnote_1.default)
    .use(markdown_it_attrs_1.default, {
    allowedAttributes: ['id', 'class', /^regex.*$/]
})
    .use(markdown_it_anchor_1.default, {
    permalink: markdown_it_anchor_1.default.permalink.headerLink(),
    slugify: (s) => (0, index_1.default)(s)
});
md.renderer.rules.footnote_block_open = () => '<h4 class="mt-3">Footnotes</h4>\n' +
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n';
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
function renderMarkdownIt(str) {
    return md.render(str);
}
exports.renderMarkdownIt = renderMarkdownIt;
/**
 * Fixable render markdown mixed with html
 * * render {@link postMap.body}
 * @todo render markdown to html
 * @param parse
 * @param verbose dump
 * @returns
 */
function renderBodyMarkdown(parse, verbose = false) {
    if (!parse)
        throw new Error('cannot render markdown of undefined');
    let body = parse.body || parse.content;
    if (typeof body != 'string')
        throw new Error('cannot render undefined markdown body');
    // extract code block first
    const re_code_block = /```[\s\S]*?```/gm;
    const codeBlocks = [];
    Array.from(body.matchAll(re_code_block)).forEach((m, i) => {
        const str = m[0];
        codeBlocks[i] = str;
        body = body.replace(str, `<codeblock${i}/>`);
    });
    if (verbose) {
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/extracted-codeblock.json'), codeBlocks);
    }
    // extract style, script
    const re = {
        script: /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gmi,
        style: /<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gmi
    };
    const extracted = {
        script: [],
        style: []
    };
    for (const key in re) {
        if (Object.prototype.hasOwnProperty.call(re, key)) {
            const regex = re[key];
            Array.from(body.matchAll(regex)).forEach((m, i) => {
                const str = m[0];
                extracted[key][i] = str;
                body = body.replace(str, `<!--${key}${i}-->`);
            });
        }
    }
    if (verbose) {
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/extracted-body.md'), body);
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/extracted-object.json'), extracted);
    }
    // restore extracted code blocks
    codeBlocks.forEach((s, i) => {
        const regex = new RegExp(`<codeblock${i}/>`, 'gm');
        Array.from(body.matchAll(regex)).forEach((codeblock) => {
            body = body.replace(codeblock[0], s);
        });
    });
    let rendered = renderMarkdownIt(body);
    if (verbose)
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/rendered.md'), rendered);
    // restore extracted script, style
    for (const key in re) {
        if (Object.prototype.hasOwnProperty.call(re, key)) {
            const regex = new RegExp(`<!--(${key})(\\d{1,2})-->`, 'gm');
            Array.from(rendered.matchAll(regex)).forEach((m) => {
                //console.log(match.length, regex, m[0], m[1], m[2]);
                const keyname = m[1];
                const index = m[2];
                const extractmatch = extracted[keyname][index];
                rendered = rendered.replace(m[0], extractmatch);
            });
        }
    }
    if (verbose)
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/restored.md'), rendered);
    return rendered;
}
exports.renderBodyMarkdown = renderBodyMarkdown;
//# sourceMappingURL=toHtml.js.map