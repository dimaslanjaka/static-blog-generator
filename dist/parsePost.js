"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const moment_1 = tslib_1.__importDefault(require("moment"));
const upath_1 = require("upath");
const yaml_1 = tslib_1.__importDefault(require("yaml"));
const persistent_cache_1 = tslib_1.__importDefault(require("../packages/persistent-cache"));
const dateMapper_1 = require("./dateMapper");
const md5_file_1 = require("./node/md5-file");
const utils_1 = require("./node/utils");
const uuid_1 = tslib_1.__importDefault(require("./node/uuid"));
const css_1 = require("./shortcodes/css");
const extractText_1 = require("./shortcodes/extractText");
const hyperlinks_md2html_1 = require("./shortcodes/hyperlinks-md2html");
const include_1 = require("./shortcodes/include");
const script_1 = require("./shortcodes/script");
const time_1 = require("./shortcodes/time");
const youtube_1 = require("./shortcodes/youtube");
const _config_1 = tslib_1.__importDefault(require("./types/_config"));
const _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp/persistent-cache'),
    name: 'parsePost',
    duration: 1000 * 3600 * 240 // 240 hours
});
const homepage = new URL(_config_1.default.url);
const default_options = {
    shortcodes: {
        css: false,
        script: false,
        include: false,
        youtube: false,
        link: false,
        text: false,
        now: false
    },
    sourceFile: null,
    formatDate: false,
    config: _config_1.default,
    cache: false
};
/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * * no cacheable
 * @param text file path or string markdown contents
 */
function parsePost(text, options = {}) {
    options = Object.assign(default_options, options);
    const config = options.config;
    const regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/gm;
    //const regex = /^---([\s\S]*?)---[\n\s\S]\n/gim;
    //let m: RegExpExecArray | { [Symbol.replace](string: string, replaceValue: string): string }[];
    /**
     * source file if `text` is file
     */
    const originalArg = text;
    const isFile = (0, fs_1.existsSync)(text) && (0, fs_1.statSync)(text).isFile();
    if (isFile) {
        text = String((0, fs_1.readFileSync)(text, 'utf-8'));
    }
    const mapper = (m) => {
        let meta = yaml_1.default.parse(m[1]);
        let body = m[2];
        if (!body)
            body = 'no content ' + (meta.title || '');
        //write(tmp('parsePost', 'original.log'), body).then(console.log);
        if (!meta.uuid) {
            // assign uuid
            let uid = m[0];
            if (meta.title && meta.webtitle) {
                uid = meta.title + meta.webtitle;
            }
            else if (meta.subtitle) {
                uid = meta.subtitle;
            }
            else if (meta.excerpt) {
                uid = meta.excerpt;
            }
            else if (meta.title) {
                uid = meta.title;
            }
            meta.uuid = (0, uuid_1.default)(uid);
            meta = Object.keys(meta)
                .sort()
                .reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: meta[key] })), {});
        }
        // @todo set default category and tags
        if ((!meta.category || !meta.category.length) && config.default_category)
            meta.category = [config.default_category];
        if ((!meta.tags || !meta.tags.length) && config.default_tag)
            meta.tags = [config.default_tag];
        // @todo set default date post
        if (!meta.date)
            meta.date = (0, moment_1.default)().format();
        if (!meta.updated) {
            if (meta.modified) {
                // fix for hexo-blogger-xml
                meta.updated = meta.modified;
                delete meta.modified;
            }
            else {
                meta.updated = meta.date;
            }
        }
        // @todo set default enable comments
        if (typeof meta.comments == 'undefined' || meta.comments == null)
            meta.comments = true;
        // @todo set default wordcount to 0
        if (!meta.wordcount)
            meta.wordcount = 0;
        // @todo set default excerpt/description
        if (meta.subtitle) {
            meta.excerpt = meta.subtitle;
            meta.description = meta.subtitle;
        }
        if (meta.description && !meta.excerpt) {
            meta.subtitle = meta.description;
            meta.excerpt = meta.description;
        }
        if (meta.excerpt && !meta.description) {
            meta.description = meta.excerpt;
            meta.subtitle = meta.excerpt;
        }
        if (isFile) {
            // setup permalink
            /*
            meta.permalink = homepage.pathname;
            homepage.pathname = meta.permalink;
            meta.url = homepage.toString();*/
            if (!meta.url) {
                homepage.pathname = (0, utils_1.replaceArr)((0, upath_1.toUnix)(originalArg), [(0, upath_1.toUnix)(process.cwd()), 'source/_posts/', 'src-posts/', '_posts/'], '/')
                    .replace(/\/+/, '/')
                    .replace(/.md$/, '.html');
                meta.url = homepage.pathname;
            }
            // determine post type
            //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
            if (!meta.type) {
                if ((0, upath_1.toUnix)(originalArg).match(/(_posts|src-posts)\//)) {
                    meta.type = 'post';
                }
                else {
                    meta.type = 'page';
                }
            }
        }
        if (typeof options === 'object') {
            // @todo format dates
            if (options.formatDate) {
                const pattern = typeof options.formatDate === 'object' && options.formatDate.pattern
                    ? options.formatDate.pattern
                    : 'YYYY-MM-DDTHH:mm:ssZ';
                meta.date = new dateMapper_1.dateMapper(String(meta.date)).format(pattern);
                meta.updated = new dateMapper_1.dateMapper(String(meta.updated)).format(pattern);
            }
            // @todo process shortcodes
            if (options.shortcodes) {
                const shortcodes = options.shortcodes;
                let sourceFile;
                if (!isFile) {
                    if (!options.sourceFile)
                        throw new Error('Shortcodes cannot process if options.sourceFile does not exist');
                    sourceFile = options.sourceFile;
                }
                else {
                    sourceFile = (0, upath_1.toUnix)(originalArg);
                }
                if (body) {
                    if (sourceFile) {
                        if (shortcodes.include)
                            body = (0, include_1.parseShortCodeInclude)(sourceFile, body);
                        if (shortcodes.now)
                            body = (0, time_1.shortcodeNow)(sourceFile, body);
                        if (shortcodes.script)
                            body = (0, script_1.shortcodeScript)(sourceFile, body);
                        if (shortcodes.css)
                            body = (0, css_1.shortcodeCss)(sourceFile, body);
                        if (shortcodes.text)
                            body = (0, extractText_1.extractText)(sourceFile, body);
                    }
                    if (shortcodes.link)
                        body = (0, hyperlinks_md2html_1.replaceMD2HTML)(body);
                    if (shortcodes.youtube)
                        body = (0, youtube_1.shortcodeYoutube)(body);
                }
            }
        }
        const result = {
            metadata: meta,
            body: body,
            content: body,
            config: config
        };
        // put fileTree
        if (isFile) {
            result.fileTree = {
                source: (0, utils_1.replaceArr)((0, upath_1.toUnix)(originalArg), ['source/_posts/', '_posts/'], 'src-posts/'),
                public: (0, upath_1.toUnix)(originalArg).replace('/src-posts/', '/source/_posts/')
            };
        }
        _cache.putSync((0, md5_file_1.md5)(meta.title), result);
        return result;
    };
    // process parsing
    const testPost = Array.from(text.matchAll(regexPost)).map(mapper)[0];
    if (typeof testPost == 'object')
        return testPost;
    const regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
    const testPage = Array.from(text.matchAll(regexPage)).map(mapper)[0];
    return testPage;
}
exports.parsePost = parsePost;
exports.default = parsePost;
//# sourceMappingURL=parsePost.js.map