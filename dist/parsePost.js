"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = void 0;
const tslib_1 = require("tslib");
const deepmerge_ts_1 = require("deepmerge-ts");
const fs_1 = require("fs");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const upath_1 = require("upath");
const yaml_1 = tslib_1.__importDefault(require("yaml"));
const persistent_cache_1 = tslib_1.__importDefault(require("../packages/persistent-cache"));
const dateMapper_1 = require("./dateMapper");
const utils_1 = require("./gulp/utils");
const array_unique_1 = tslib_1.__importStar(require("./node/array-unique"));
const md5_file_1 = require("./node/md5-file");
const utils_2 = require("./node/utils");
const uuid_1 = tslib_1.__importDefault(require("./node/uuid"));
const css_1 = require("./shortcodes/css");
const extractText_1 = require("./shortcodes/extractText");
const hyperlinks_md2html_1 = require("./shortcodes/hyperlinks-md2html");
const include_1 = require("./shortcodes/include");
const script_1 = require("./shortcodes/script");
const time_1 = require("./shortcodes/time");
const youtube_1 = require("./shortcodes/youtube");
const _config_1 = tslib_1.__importDefault(require("./types/_config"));
/**
 * Localized Moment
 * @param date
 * @returns
 */
function moment(date = new Date()) {
    let parse = (0, moment_timezone_1.default)(date);
    if (_config_1.default.timezone) {
        parse = parse.tz(_config_1.default.timezone);
    }
    return parse;
}
const _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp/persistent-cache'),
    name: 'parsePost',
    duration: 1000 * 3600 * 24 // 24 hours
});
const homepage = new URL(_config_1.default.url);
const cwd = () => (0, upath_1.toUnix)(process.cwd());
/**
 * Hexo Generated Dir
 */
const post_generated_dir = (0, upath_1.join)(cwd(), _config_1.default.public_dir);
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
    cache: false,
    fix: false
};
/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param text file path or string markdown contents
 */
function parsePost(text, options = {}) {
    options = (0, deepmerge_ts_1.deepmerge)(default_options, options);
    const config = options.config;
    const cacheKey = (0, md5_file_1.md5FileSync)(text);
    if (options.cache) {
        const getCache = _cache.getSync(cacheKey);
        if (getCache)
            return getCache;
    }
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
        if (options.fix) {
            // @todo fix date
            if (!meta.date) {
                meta.date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
            }
            if (meta.modified && !meta.updated) {
                meta.updated = moment(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
            }
            if (isFile) {
                const sourceFile = (0, upath_1.toUnix)(originalArg);
                if ((0, fs_1.existsSync)(sourceFile)) {
                    const stats = (0, fs_1.statSync)(sourceFile);
                    if (!meta.updated) {
                        const mtime = stats.mtime;
                        meta.updated = moment(mtime).format('YYYY-MM-DDTHH:mm:ssZ');
                    }
                }
            }
            // @todo fix lang
            if (!meta.lang)
                meta.lang = 'en';
        }
        // @todo set default category and tags
        if (!meta.category)
            meta.category = [];
        if (config.default_category && !meta.category.length)
            meta.category.push(config.default_category);
        if (!meta.tags)
            meta.tags = [];
        if (config.default_tag && !meta.tags.length)
            meta.tags.push(config.default_tag);
        // @todo set default date post
        if (!meta.date)
            meta.date = moment().format();
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
        // @todo fix thumbnail
        if (options.fix) {
            const thumbnail = meta.cover || meta.thumbnail;
            if (thumbnail) {
                if (!meta.thumbnail)
                    meta.thumbnail = thumbnail;
                if (!meta.cover)
                    meta.cover = thumbnail;
                if (!meta.photos) {
                    meta.photos = [];
                }
                meta.photos.push(meta.cover);
            }
            if (meta.photos) {
                const photos = meta.photos;
                meta.photos = (0, array_unique_1.default)(photos);
            }
        }
        // @todo fix post author
        if (options.fix) {
            const author = meta.author || config.author;
            if (!meta.author && author) {
                meta.author = author;
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
        else if (meta.description && !meta.excerpt) {
            meta.subtitle = meta.description;
            meta.excerpt = meta.description;
        }
        else if (meta.excerpt && !meta.description) {
            meta.description = meta.excerpt;
            meta.subtitle = meta.excerpt;
        }
        else {
            const newExcerpt = `${meta.title} - ${config.title}`;
            meta.description = newExcerpt;
            meta.subtitle = newExcerpt;
            meta.excerpt = newExcerpt;
        }
        // @todo fix description
        if (options.fix) {
            // fix special char in metadata
            meta.title = (0, utils_2.cleanString)(meta.title);
            meta.subtitle = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.subtitle));
            meta.excerpt = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.excerpt));
            meta.description = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.description));
        }
        // @todo fix default category and tags
        if (options.fix) {
            // remove uncategorized if programming category pushed
            if (config.default_category)
                if (meta.category.includes(config.default_category) &&
                    meta.category.length > 1) {
                    meta.category = meta.category.filter((e) => e !== config.default_category);
                }
            // @todo remove untagged if programming category pushed
            if (config.default_tag)
                if (meta.tags.includes(config.default_tag) && meta.tags.length > 1) {
                    meta.tags = meta.tags.filter((e) => e !== config.default_tag);
                }
        }
        // @todo remove duplicated metadata photos
        if (options.fix && meta.photos && meta.photos.length) {
            meta.photos = (0, array_unique_1.uniqueStringArray)(meta.photos);
        }
        // @todo delete location
        if (Object.prototype.hasOwnProperty.call(meta, 'location') &&
            !meta.location) {
            delete meta.location;
        }
        if (isFile || options.sourceFile) {
            const publicFile = isFile ? (0, upath_1.toUnix)(originalArg) : options.sourceFile;
            // @todo fix post_asset_folder
            if (options.fix) {
                const post_assets_fixer = (str) => {
                    if (!publicFile)
                        return str;
                    // return base64 image
                    if (str.startsWith('data:image'))
                        return str;
                    if (str.startsWith('//'))
                        str = 'http:' + str;
                    if (str.includes('%20'))
                        str = decodeURIComponent(str);
                    if (!(0, utils_1.isValidHttpUrl)(str) && !str.startsWith('/')) {
                        let result;
                        /** search from same directory */
                        const f1 = (0, upath_1.join)((0, upath_1.dirname)(publicFile), str);
                        /** search from parent directory */
                        const f2 = (0, upath_1.join)((0, upath_1.dirname)((0, upath_1.dirname)(publicFile)), str);
                        /** search from root directory */
                        const f3 = (0, upath_1.join)(cwd(), str);
                        const f4 = (0, upath_1.join)(post_generated_dir, str);
                        [f1, f2, f3, f4].forEach((src) => {
                            if ((0, fs_1.existsSync)(src) && !result)
                                result = src;
                        });
                        if (!result) {
                            console.log('[PAF][fail]', str);
                        }
                        else {
                            result = (0, utils_2.replaceArr)(result, [cwd(), 'source/', '_posts'], '/').replace(/\/+/, '/');
                            result = encodeURI(result);
                            console.log('[PAF][success]', result);
                            return result;
                        }
                    }
                    return str;
                };
                if (meta.cover) {
                    meta.cover = post_assets_fixer(meta.cover);
                }
                if (meta.thumbnail) {
                    meta.thumbnail = post_assets_fixer(meta.thumbnail);
                }
                if (meta.photos) {
                    meta.photos = meta.photos.map(post_assets_fixer);
                }
            }
            if (!meta.url) {
                homepage.pathname = (0, utils_2.replaceArr)(publicFile, [
                    (0, upath_1.toUnix)(process.cwd()),
                    config.source_dir + '/_posts/',
                    'src-posts/',
                    '_posts/'
                ], '/')
                    // @todo remove multiple slashes
                    .replace(/\/+/, '/')
                    // @todo replace .md to .html
                    .replace(/.md$/, '.html');
                // meta url with full url
                meta.url = homepage.toString();
                // meta permalink just pathname
                meta.permalink = homepage.pathname;
            }
            // determine post type
            //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
            if (!meta.type) {
                if (publicFile.match(/(_posts|src-posts)\//)) {
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
                source: (0, utils_2.replaceArr)((0, upath_1.toUnix)(originalArg), ['source/_posts/', '_posts/'], 'src-posts/'),
                public: (0, upath_1.toUnix)(originalArg).replace('/src-posts/', '/source/_posts/')
            };
        }
        if (meta && body)
            _cache.putSync(cacheKey, result);
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