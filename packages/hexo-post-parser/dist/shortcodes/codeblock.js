"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeCodeblock = void 0;
const axios_1 = __importDefault(require("axios"));
const persistent_cache_1 = __importDefault(require("persistent-cache"));
const upath_1 = require("upath");
const color_1 = __importDefault(require("../node/color"));
const jsdom_1 = __importDefault(require("../node/jsdom"));
const md5_file_1 = require("../node/md5-file");
const utils_1 = require("../node/utils");
const _config_1 = require("../types/_config");
const dom = new jsdom_1.default();
const _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp'),
    name: 'shortcode/codeblock',
    duration: 1000 * 3600 * 24 // 24 hours
});
const logname = color_1.default.Shamrock('[codeblock]');
function shortcodeCodeblock(str) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, _config_1.getConfig)();
        const regex = /(\{% codeblock (.*?) %\}|\{% codeblock %\})((.*?|\n)+?)(\{% endcodeblock %\})/gim;
        let m;
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            const codeblock = m[0];
            const openingTag = m[1];
            const closingTag = m[5];
            const args = m[2];
            const content = m[3];
            if (!args) {
                const plain = (0, utils_1.replaceArr)(codeblock, [openingTag, closingTag], [
                    '<pre><code><!-- prettier-ignore-start -->',
                    '<!-- prettier-ignore-end --></code></pre>'
                ]);
                str = str.replace(codeblock, plain);
            }
            else {
                const build = [];
                const splitArgs = args.split(/\s/).map((s) => s.trim());
                // get title codeblock
                const title = typeof splitArgs[0] == 'string' && !splitArgs[0].startsWith('lang:')
                    ? splitArgs[0]
                    : null;
                if (typeof title == 'string' && title.length > 0) {
                    build.push(`<span>${title}</span>`);
                }
                // get url page title codeblock
                const url = splitArgs
                    .filter((s) => {
                    try {
                        new URL(s);
                        return s.match(/^(https|ftps|ssh|git*)?:\/\//);
                    }
                    catch (error) {
                        return false;
                    }
                })
                    .filter((s) => typeof s == 'string' && s.length > 0);
                let urlTitle;
                if (url.length > 0) {
                    // cache key
                    const cacheKey = (0, md5_file_1.md5)(url[0]);
                    // get cache otherwise null
                    urlTitle = _cache.getSync(cacheKey);
                    if (url[0].match(/^https?:\/\//) && !urlTitle) {
                        try {
                            const res = yield axios_1.default.get(url[0]);
                            if (res.status === 200) {
                                const doc = dom.parse(res.data);
                                // assign url page title
                                urlTitle = doc.title.trim();
                                // close dom, avoid memory leaks
                                dom.close();
                                // set cache
                                _cache.putSync(cacheKey, urlTitle);
                                if (config.generator.verbose)
                                    console.log(logname, 'resolved url title', urlTitle);
                            }
                            else {
                                throw new Error('Response status not !== 200');
                            }
                        }
                        catch (error) {
                            if (config.generator.verbose) {
                                if (error instanceof Error)
                                    console.log(error.message);
                                console.log('cannot resolve', url);
                            }
                        }
                    }
                    if (typeof urlTitle == 'string') {
                        build.push(`<a target="_blank" rel="noopener external nofollow noreferrer" href="${url[0]}">${urlTitle}</a>`);
                    }
                }
                // get language type codeblock
                const langs = splitArgs
                    .filter((s) => {
                    if (typeof s == 'string')
                        return s.startsWith('lang:');
                    return false;
                })
                    .map((s) => {
                    if (typeof s == 'string')
                        return s.split(':')[1];
                });
                let codeblockBuild = '';
                if ((typeof title == 'string' && title.length > 0) ||
                    (typeof urlTitle == 'string' && urlTitle.length > 0)) {
                    codeblockBuild += `<figure class="highlight plain"><figcaption>${build.join('')}</figcaption>`;
                }
                if (langs.length > 0) {
                    const lang = langs[0];
                    codeblockBuild += `<pre class="highlight language-${lang}"><code><!-- prettier-ignore-start -->${content}<!-- prettier-ignore-end --></code></pre></figure>`;
                }
                else {
                    codeblockBuild += `<pre><code><!-- prettier-ignore-start -->${content}<!-- prettier-ignore-end --></code></pre></figure>`;
                }
                str = str.replace(codeblock, codeblockBuild);
            }
        }
        return str;
    });
}
exports.shortcodeCodeblock = shortcodeCodeblock;
//# sourceMappingURL=codeblock.js.map