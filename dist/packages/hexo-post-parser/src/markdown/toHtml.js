"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBodyMarkdown = exports.renderMarkdownIt = exports.converterOpt = void 0;
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
function renderShowdown(str) {
    var converter = new showdown_1.default.Converter(exports.converterOpt);
    return converter.makeHtml(str);
}
exports.default = renderShowdown;
var md = new markdown_it_1.default({
    html: true,
    linkify: false,
    typographer: true,
    breaks: false,
    langPrefix: 'language-'
});
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
function renderMarkdownIt(str) {
    return md.render(str);
}
exports.renderMarkdownIt = renderMarkdownIt;
function renderBodyMarkdown(parse, verbose) {
    if (verbose === void 0) { verbose = false; }
    if (!parse)
        throw new Error('cannot render markdown of undefined');
    var body = parse.body || parse.content;
    if (typeof body != 'string')
        throw new Error('cannot render undefined markdown body');
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
    codeBlocks.forEach(function (s, i) {
        var regex = new RegExp("<codeblock".concat(i, "/>"), 'gm');
        Array.from(body.matchAll(regex)).forEach(function (codeblock) {
            body = body.replace(codeblock[0], s);
        });
    });
    var rendered = renderMarkdownIt(body);
    if (verbose)
        (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, 'tmp/rendered.md'), rendered);
    for (var key in re) {
        if (Object.prototype.hasOwnProperty.call(re, key)) {
            var regex = new RegExp("<!--(".concat(key, ")(\\d{1,2})-->"), 'gm');
            Array.from(rendered.matchAll(regex)).forEach(function (m) {
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
