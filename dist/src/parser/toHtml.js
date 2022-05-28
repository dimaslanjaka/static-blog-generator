"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBodyMarkdown = exports.renderMarkdownIt = exports.converterOpt = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var markdown_it_1 = __importDefault(require("markdown-it"));
var markdown_it_abbr_1 = __importDefault(require("markdown-it-abbr"));
var markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
var markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
var markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
var markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
var markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
var markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
var showdown_1 = __importDefault(require("showdown"));
var filemanager_1 = require("../node/filemanager");
var index_1 = __importDefault(require("../node/slugify/index"));
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
    var converter = new showdown_1.default.Converter(exports.converterOpt);
    return converter.makeHtml(str);
}
exports.default = renderShowdown;
var md = new markdown_it_1.default({
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
    slugify: function (s) { return (0, index_1.default)(s); }
});
md.renderer.rules.footnote_block_open = function () {
    return '<h4 class="mt-3">Footnotes</h4>\n' +
        '<section class="footnotes">\n' +
        '<ol class="footnotes-list">\n';
};
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
function renderBodyMarkdown(parse, verbose) {
    if (verbose === void 0) { verbose = false; }
    if (!parse)
        throw new Error('cannot render markdown of undefined');
    var body = parse.body; // || parse.content;
    if (typeof body != 'string')
        throw new Error('cannot render undefined markdown body');
    // extract code block first
    var re_code_block = /```[\s\S]*?```/gm;
    var codeBlocks = [];
    Array.from(body.matchAll(re_code_block)).forEach(function (m, i) {
        var str = m[0];
        codeBlocks[i] = str;
        body = body.replace(str, "<codeblock".concat(i, "/>"));
    });
    if (verbose) {
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/extracted-codeblock.json'), codeBlocks);
    }
    // extract style, script
    var re = {
        script: /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gm,
        style: /<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gm
    };
    var extracted = {
        script: [],
        style: []
    };
    var _loop_1 = function (key) {
        if (Object.prototype.hasOwnProperty.call(re, key)) {
            var regex = re[key];
            Array.from(body.matchAll(regex)).forEach(function (m, i) {
                var str = m[0];
                extracted[key][i] = str;
                body = body.replace(str, "<!--".concat(key).concat(i, "-->"));
            });
        }
    };
    for (var key in re) {
        _loop_1(key);
    }
    if (verbose) {
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/extracted-body.md'), body);
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/extracted-object.json'), extracted);
    }
    // restore extracted code blocks
    codeBlocks.forEach(function (s, i) {
        var regex = new RegExp("<codeblock".concat(i, "/>"), 'gm');
        Array.from(body.matchAll(regex)).forEach(function (codeblock) {
            body = body.replace(codeblock[0], s);
        });
    });
    var rendered = renderMarkdownIt(body);
    if (verbose)
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/rendered.md'), rendered);
    // restore extracted script, style
    for (var key in re) {
        if (Object.prototype.hasOwnProperty.call(re, key)) {
            var regex = new RegExp("<!--(".concat(key, ")(\\d{1,2})-->"), 'gm');
            Array.from(rendered.matchAll(regex)).forEach(function (m) {
                //console.log(match.length, regex, m[0], m[1], m[2]);
                var keyname = m[1];
                var index = m[2];
                var extractmatch = extracted[keyname][index];
                rendered = rendered.replace(m[0], extractmatch);
            });
        }
    }
    if (verbose)
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/restored.md'), rendered);
    return rendered;
}
exports.renderBodyMarkdown = renderBodyMarkdown;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9IdG1sLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3BhcnNlci90b0h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0VBQXNFO0FBQ3RFLDREQUFxQztBQUNyQyxzRUFBOEM7QUFDOUMsMEVBQWtEO0FBQ2xELHdFQUFnRDtBQUNoRCw4RUFBc0Q7QUFDdEQsc0VBQThDO0FBQzlDLG9FQUE0QztBQUM1QyxvRUFBNEM7QUFDNUMsc0RBQWdDO0FBQ2hDLG1EQUFrRDtBQUNsRCxnRUFBNEM7QUFHL0IsUUFBQSxZQUFZLEdBQUc7SUFDMUIsYUFBYSxFQUFFLElBQUk7SUFDbkIsTUFBTSxFQUFFLElBQUk7SUFDWixjQUFjLEVBQUUsSUFBSTtDQUNyQixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILFNBQXdCLGNBQWMsQ0FBQyxHQUFXO0lBQ2hELElBQU0sU0FBUyxHQUFHLElBQUksa0JBQVEsQ0FBQyxTQUFTLENBQUMsb0JBQVksQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBSEQsaUNBR0M7QUFDRCxJQUFNLEVBQUUsR0FBRyxJQUFJLHFCQUFVLENBQUM7SUFDeEIsSUFBSSxFQUFFLElBQUk7SUFDVixxQ0FBcUM7SUFDckMsT0FBTyxFQUFFLEtBQUs7SUFDZCxtRUFBbUU7SUFDbkUsK0hBQStIO0lBQy9ILFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsVUFBVSxFQUFFLFdBQVcsQ0FBQyxrRkFBa0Y7Q0FDM0csQ0FBQyxDQUFDO0FBQ0gsNkVBQTZFO0FBQzdFLEVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQWEsQ0FBQztLQUNsQixHQUFHLENBQUMseUJBQWEsQ0FBQztLQUNsQixHQUFHLENBQUMsMEJBQWMsQ0FBQztLQUNuQixHQUFHLENBQUMsMEJBQWMsQ0FBQztLQUNuQixHQUFHLENBQUMsOEJBQWtCLENBQUM7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