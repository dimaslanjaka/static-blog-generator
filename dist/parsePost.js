"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = void 0;
const tslib_1 = require("tslib");
const deepmerge_ts_1 = require("deepmerge-ts");
const fs_extra_1 = require("fs-extra");
const jsdom_1 = require("jsdom");
const persistent_cache_1 = tslib_1.__importDefault(require("persistent-cache"));
const upath_1 = require("upath");
const yaml_1 = tslib_1.__importDefault(require("yaml"));
const dateMapper_1 = require("./dateMapper");
const generatePostId_1 = require("./generatePostId");
const utils_1 = require("./gulp/utils");
const toHtml_1 = require("./markdown/toHtml");
const array_unique_1 = tslib_1.__importStar(require("./node/array-unique"));
const color_1 = tslib_1.__importDefault(require("./node/color"));
const filemanager_1 = require("./node/filemanager");
const md5_file_1 = require("./node/md5-file");
const sanitize_filename_1 = tslib_1.__importDefault(require("./node/sanitize-filename"));
const utils_2 = require("./node/utils");
const parsePermalink_1 = require("./parsePermalink");
const codeblock_1 = require("./shortcodes/codeblock");
const css_1 = require("./shortcodes/css");
const extractText_1 = require("./shortcodes/extractText");
const hyperlinks_md2html_1 = require("./shortcodes/hyperlinks-md2html");
const include_1 = require("./shortcodes/include");
const script_1 = require("./shortcodes/script");
const time_1 = require("./shortcodes/time");
const youtube_1 = require("./shortcodes/youtube");
const _config_1 = tslib_1.__importStar(require("./types/_config"));
const string_1 = require("./utils/string");
const _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp/persistent-cache'),
    name: 'parsePost',
    duration: 1000 * 3600 * 24 // 24 hours
});
const default_options = {
    shortcodes: {
        css: false,
        script: false,
        include: false,
        youtube: false,
        link: false,
        text: false,
        now: false,
        codeblock: false
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
 * @param target file path or string markdown contents (used for cache key)
 * @param options options parser
 * * {@link ParseOptions.sourceFile} used for cache key when `target` is file contents
 */
function parsePost(target, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!target)
            return null;
        options = (0, deepmerge_ts_1.deepmerge)(default_options, options);
        // , { sourceFile: target }
        if (!options.sourceFile && (0, fs_extra_1.existsSync)(target))
            options.sourceFile = target;
        if (!options.config)
            options.config = _config_1.default;
        const HexoConfig = options.config;
        const homepage = HexoConfig.url.endsWith('/')
            ? HexoConfig.url
            : HexoConfig.url + '/';
        const fileTarget = options.sourceFile || target;
        const cacheKey = (0, fs_extra_1.existsSync)(fileTarget)
            ? (0, md5_file_1.md5FileSync)(fileTarget)
            : (0, md5_file_1.md5)(fileTarget);
        if (options.cache) {
            //console.log('use cache');
            const getCache = _cache.getSync(cacheKey);
            if (getCache)
                return getCache;
        }
        else {
            //console.log('rewrite cache');
        }
        /**
         * source file if variable `text` is file
         */
        let originalFile = target;
        const isFile = (0, fs_extra_1.existsSync)(target) && (0, fs_extra_1.statSync)(target).isFile();
        if (isFile) {
            target = String((0, fs_extra_1.readFileSync)(target, 'utf-8'));
            if (options.sourceFile)
                originalFile = options.sourceFile;
        }
        const mapper = (m) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!m) {
                throw new Error(originalFile + ' cannot be mapped');
            }
            let meta = {
                title: '',
                subtitle: '',
                date: '',
                tags: [],
                category: []
            };
            try {
                meta = yaml_1.default.parse(m[1]);
            }
            catch (error) {
                //if (error instanceof Error) console.log(error.message, 'cannot parse metadata');
                return null;
            }
            if (typeof meta !== 'object') {
                //writeFileSync(join(cwd(), 'tmp/dump.json'), JSON.stringify(m, null, 2));
                //console.log('meta required object');
                return null;
            }
            let body = m[2];
            if (!body)
                body = 'no content ' + (meta.title || '');
            //write(tmp('parsePost', 'original.log'), body).then(console.log);
            if (!meta.id) {
                // assign post id
                meta.id = (0, generatePostId_1.generatePostId)(meta);
            }
            if (options.fix) {
                // @todo fix date
                if (!meta.date) {
                    meta.date = (0, dateMapper_1.moment)(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
                }
                if (meta.modified && !meta.updated) {
                    meta.updated = (0, dateMapper_1.moment)(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
                }
                if (!meta.updated) {
                    // @todo metadata date modified based on date published
                    let date = String(meta.date);
                    if (/\d{4}-\d-\d{2}/.test(date))
                        date = new Date(String(meta.date));
                    meta.updated = (0, dateMapper_1.moment)(date).format('YYYY-MM-DDTHH:mm:ssZ');
                }
                /*
                // change date modified based on file modified date
                if (isFile) {
                  const sourceFile = toUnix(originalArg);
                  if (existsSync(sourceFile)) {
                    if (!meta.updated) {
                      const stats = statSync(sourceFile);
                      const mtime = stats.mtime;
                      meta.updated = moment(mtime).format('YYYY-MM-DDTHH:mm:ssZ');
                    }
                  }
                }
                */
                // @todo fix lang
                if (!meta.lang)
                    meta.lang = 'en';
            }
            // @todo set default category and tags
            if (!meta.category)
                meta.category = [];
            if (options.config.default_category && !meta.category.length)
                meta.category.push(options.config.default_category);
            if (!meta.tags)
                meta.tags = [];
            if (options.config.default_tag && !meta.tags.length)
                meta.tags.push(options.config.default_tag);
            // @todo set default date post
            if (!meta.date)
                meta.date = (0, dateMapper_1.moment)().format();
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
            else {
                if (meta.modified) {
                    // fix for hexo-blogger-xml
                    delete meta.modified;
                }
            }
            // @todo fix thumbnail
            if (options.fix) {
                const thumbnail = meta.cover || meta.thumbnail;
                if (typeof thumbnail === 'string' && thumbnail.trim().length > 0) {
                    if (!meta.thumbnail)
                        meta.thumbnail = thumbnail;
                    if (!meta.cover)
                        meta.cover = thumbnail;
                    if (!meta.photos) {
                        meta.photos = [];
                    }
                    meta.photos.push(meta.cover);
                }
                if (Array.isArray(meta.photos)) {
                    const photos = meta.photos.filter((str) => typeof str === 'string' && str.trim().length > 0);
                    meta.photos = (0, array_unique_1.default)(photos);
                }
            }
            // @todo fix post author
            if (options.fix) {
                const author = meta.author || options.config.author;
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
                const newExcerpt = `${meta.title} - ${options.config.title}`;
                meta.description = newExcerpt;
                meta.subtitle = newExcerpt;
                meta.excerpt = newExcerpt;
            }
            // @todo fix description
            if (options.fix) {
                // fix empty title
                if (typeof meta.title !== 'string' || meta.title.trim().length === 0) {
                    meta.title = (0, upath_1.basename)(options.sourceFile);
                }
                // fix special char in metadata
                meta.title = (0, utils_2.cleanString)(meta.title);
                meta.subtitle = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.subtitle));
                meta.excerpt = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.excerpt));
                meta.description = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.description));
            }
            // @todo fix default category and tags
            if (options.fix) {
                // remove uncategorized if programming category pushed
                if (options.config.default_category)
                    if (meta.category.includes(options.config.default_category) &&
                        meta.category.length > 1) {
                        meta.category = meta.category.filter((e) => e !== options.config.default_category);
                    }
                // @todo remove untagged if programming category pushed
                if (options.config.default_tag)
                    if (meta.tags.includes(options.config.default_tag) &&
                        meta.tags.length > 1) {
                        meta.tags = meta.tags.filter((e) => e !== options.config.default_tag);
                    }
            }
            // @todo remove duplicated metadata photos
            if (options.fix &&
                'photos' in meta &&
                Array.isArray(meta.photos) &&
                meta.photos.length > 0) {
                try {
                    meta.photos = (0, array_unique_1.uniqueStringArray)(meta.photos.filter((str) => str.trim().length > 0));
                }
                catch (e) {
                    console.error('cannot unique photos', meta.title, e.message);
                }
            }
            // @todo delete location
            if (Object.prototype.hasOwnProperty.call(meta, 'location') &&
                !meta.location) {
                delete meta.location;
            }
            if (isFile || options.sourceFile) {
                let publicFile;
                if (isFile) {
                    publicFile = (0, upath_1.toUnix)((0, filemanager_1.normalize)(originalFile));
                }
                else if (options.sourceFile) {
                    publicFile = (0, upath_1.toUnix)((0, filemanager_1.normalize)(options.sourceFile));
                }
                else {
                    throw new Error('cannot find public file of ' + meta.title);
                }
                /**
                 * Post Asset Fixer
                 * @param sourcePath
                 * @returns
                 */
                const post_assets_fixer = (sourcePath) => {
                    var _a;
                    const logname = color_1.default.Blue('[PAF]');
                    if (!publicFile)
                        return sourcePath;
                    // replace extended title from source
                    sourcePath = sourcePath.replace(/['"](.*)['"]/gim, '').trim();
                    // return base64 image
                    if (sourcePath.startsWith('data:image'))
                        return sourcePath;
                    if (sourcePath.startsWith('//'))
                        sourcePath = 'http:' + sourcePath;
                    if (sourcePath.includes('%20'))
                        sourcePath = decodeURIComponent(sourcePath);
                    if (!(0, utils_1.isValidHttpUrl)(sourcePath) && !sourcePath.startsWith('/')) {
                        let result = null;
                        /** search from same directory */
                        const f1 = (0, upath_1.join)((0, upath_1.dirname)(publicFile), sourcePath);
                        /** search from parent directory */
                        const f2 = (0, upath_1.join)((0, upath_1.dirname)((0, upath_1.dirname)(publicFile)), sourcePath);
                        /** search from root directory */
                        const f3 = (0, upath_1.join)(process.cwd(), sourcePath);
                        const f4 = (0, upath_1.join)(_config_1.post_generated_dir, sourcePath);
                        [f1, f2, f3, f4].forEach((src) => {
                            if (result !== null)
                                return;
                            if ((0, fs_extra_1.existsSync)(src) && !result)
                                result = src;
                        });
                        if (result === null) {
                            const log = (0, upath_1.join)(__dirname, '../tmp/errors/post-asset-folder/' +
                                (0, sanitize_filename_1.default)((0, upath_1.basename)(sourcePath).trim(), '-') +
                                '.log');
                            if (!(0, fs_extra_1.existsSync)((0, upath_1.dirname)(log))) {
                                (0, fs_extra_1.mkdirpSync)((0, upath_1.dirname)(log));
                            }
                            (0, fs_extra_1.writeFileSync)(log, JSON.stringify({ str: sourcePath, f1, f2, f3, f4 }, null, 2));
                            console.log(logname, color_1.default.redBright('[fail]'), {
                                str: sourcePath,
                                log
                            });
                        }
                        else {
                            result = (0, utils_2.replaceArr)(result, [(0, upath_1.toUnix)(process.cwd()), 'source/', '_posts', 'src-posts'], '/');
                            result = encodeURI((((_a = options.config) === null || _a === void 0 ? void 0 : _a.root) || '') + result);
                            result = (0, string_1.removeDoubleSlashes)(result);
                            if (options.config && options.config['verbose'])
                                console.log(logname, '[success]', result);
                            return result;
                        }
                    }
                    return sourcePath;
                };
                // @todo fix post_asset_folder
                if (options.fix) {
                    if (meta.cover) {
                        meta.cover = post_assets_fixer(meta.cover);
                    }
                    // fix thumbnail
                    if (meta.thumbnail) {
                        meta.thumbnail = post_assets_fixer(meta.thumbnail);
                    }
                    // add property photos by default
                    if (!meta.photos)
                        meta.photos = [];
                    if (body && isFile) {
                        // get all images from post body
                        const imagefinderreplacement = function (whole, m1) {
                            //console.log('get all images', m1);
                            const regex = /(?:".*")/;
                            let replacementResult;
                            let img;
                            if (regex.test(m1)) {
                                const replacement = m1.replace(regex, '').trim();
                                img = post_assets_fixer(replacement);
                                replacementResult = whole.replace(replacement, img);
                            }
                            if (!replacementResult) {
                                img = post_assets_fixer(m1);
                                replacementResult = whole.replace(m1, img);
                            }
                            // push image to photos metadata
                            if (typeof img === 'string')
                                meta.photos.push(img);
                            return replacementResult;
                        };
                        // markdown image
                        body = body.replace(/!\[.*\]\((.*)\)/gm, imagefinderreplacement);
                        // html image
                        const regex = /<img [^>]*src="[^"]*"[^>]*>/gm;
                        if (regex.test(body)) {
                            body.match(regex).map((x) => {
                                return x.replace(/.*src="([^"]*)".*/, imagefinderreplacement);
                            });
                        }
                    }
                    // fix photos
                    if (Array.isArray(meta.photos)) {
                        meta.photos = meta.photos
                            .filter((str) => typeof str === 'string' && str.trim().length > 0)
                            .map((photo) => post_assets_fixer(photo))
                            // unique
                            .filter(function (x, i, a) {
                            return a.indexOf(x) === i;
                        });
                        // add thumbnail if not exist and photos length > 0
                        if (!meta.thumbnail && meta.photos.length > 0) {
                            meta.thumbnail = meta.photos[0];
                        }
                    }
                }
                if (!meta.url) {
                    const url = (0, utils_2.replaceArr)((0, upath_1.toUnix)((0, filemanager_1.normalize)(publicFile)), [
                        (0, upath_1.toUnix)((0, filemanager_1.normalize)(process.cwd())),
                        ((_a = options.config) === null || _a === void 0 ? void 0 : _a.source_dir) + '/_posts/',
                        'src-posts/',
                        '_posts/'
                    ], '/')
                        // @todo remove multiple slashes
                        .replace(/\/+/, '/')
                        .replace(/^\/+/, '/')
                        // @todo replace .md to .html
                        .replace(/.md$/, '.html');
                    // meta url with full url and removed multiple forward slashes
                    meta.url = new URL(homepage + url)
                        .toString()
                        .replace(/([^:]\/)\/+/g, '$1');
                }
                // determine post type
                //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
                if (!meta.type) {
                    if (publicFile.match(/(_posts|_drafts|src-posts)\//)) {
                        meta.type = 'post';
                    }
                    else {
                        meta.type = 'page';
                    }
                }
            }
            if (options.config && 'generator' in options.config) {
                if (meta.type && !meta.layout && options.config.generator.type) {
                    meta.layout = meta.type;
                }
            }
            if (typeof options === 'object') {
                // @todo format dates
                if (options.formatDate) {
                    const pattern = typeof options.formatDate === 'object' && options.formatDate.pattern
                        ? options.formatDate.pattern
                        : 'YYYY-MM-DDTHH:mm:ssZ';
                    if (meta.date) {
                        meta.date = new dateMapper_1.dateMapper(String(meta.date)).format(pattern);
                    }
                    if (meta.updated) {
                        meta.updated = new dateMapper_1.dateMapper(String(meta.updated)).format(pattern);
                    }
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
                        sourceFile = (0, upath_1.toUnix)(originalFile);
                    }
                    if (body) {
                        if (sourceFile) {
                            if (shortcodes.include) {
                                // @todo parse shortcode include
                                body = (0, include_1.parseShortCodeInclude)(sourceFile, body);
                            }
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
                        if (shortcodes.codeblock)
                            body = yield (0, codeblock_1.shortcodeCodeblock)(body);
                    }
                }
            }
            // @todo count words when wordcount is 0
            if (meta.wordcount === 0 &&
                typeof body === 'string' &&
                body.trim().length > 0) {
                const render = (0, toHtml_1.renderMarkdownIt)(body);
                const dom = new jsdom_1.JSDOM(render);
                const words = Array.from(dom.window.document.querySelectorAll('*:not(script,style,meta,link)'))
                    .map((e) => e.textContent)
                    .join('\n');
                meta.wordcount = (0, string_1.countWords)(words);
            }
            // sort metadata
            meta = Object.keys(meta)
                .sort()
                .reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: meta[key] })), {});
            const result = {
                metadata: meta,
                body: body,
                content: body,
                config: HexoConfig
            };
            if ('permalink' in result.metadata === false) {
                result.metadata.permalink = (0, parsePermalink_1.parsePermalink)(result);
            }
            result.metadata.slug = result.metadata.permalink;
            // put fileTree
            if (isFile) {
                result.fileTree = {
                    source: (0, utils_2.replaceArr)((0, upath_1.toUnix)(originalFile), ['source/_posts/', '_posts/'], 'src-posts/'),
                    public: (0, upath_1.toUnix)(originalFile).replace('/src-posts/', '/source/_posts/')
                };
            }
            if (meta && body)
                _cache.putSync(cacheKey, result);
            return result;
        });
        // test opening metadata tag
        const regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
        const testPost = Array.from(target.matchAll(regexPost)).map(mapper)[0];
        if (typeof testPost === 'object' && testPost !== null) {
            //console.log('test 1 passed');
            return testPost;
        }
        // test non-opening metadata tag
        const regexPostNoOpening = /^([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
        const testPost2 = Array.from(target.matchAll(regexPostNoOpening)).map(mapper)[0];
        if (typeof testPost2 === 'object' && testPost2 !== null) {
            //console.log('test 2 passed');
            return testPost2;
        }
        const regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
        const testPage = Array.from(target.matchAll(regexPage)).map(mapper)[0];
        if (typeof testPage === 'object' && testPage !== null)
            return testPage;
        return null;
    });
}
exports.parsePost = parsePost;
exports.default = parsePost;
//# sourceMappingURL=parsePost.js.map