"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermalink = void 0;
const upath_1 = __importDefault(require("upath"));
const dateMapper_1 = require("./dateMapper");
const debug_1 = __importDefault(require("./node/debug"));
const _config_1 = require("./types/_config");
/**
 * transform permalink format in `_config.yml`
 * @param post post path
 */
function parsePermalink(post, config) {
    (0, debug_1.default)('permalink').extend('source')(post);
    let pattern = config.permalink || (0, _config_1.getConfig)().permalink;
    const date = config.date;
    const cleanPathname = post.replace(/.md$/, '');
    /**
     * @see {@link https://hexo.io/docs/permalinks.html}
     */
    const replacer = {
        ':month': 'MM',
        ':year': 'YYYY',
        ':day': 'DD',
        ':i_month': 'M',
        ':hour': 'HH',
        ':minute': 'mm',
        ':second': 'ss',
        // Filename (without pathname)
        ':title': cleanPathname,
        // Filename (relative to “source/_posts/“ folder)
        ':name': upath_1.default.basename(cleanPathname),
        ':post_title': config.title
    };
    //console.log({ url, curl: config.url });
    // @todo [permalink] follow directory path
    /*if (pattern.startsWith(':title')) {
      const bname = pattern.replace(':title', replacer[':title']);
      const perm = path.join(path.dirname(String(url)), bname);
      debug('permalink')(perm);
      return perm;
    }*/
    for (const date_pattern in replacer) {
        if ([':title', ':post_title', ':id', ':category', ':hash', ':name'].includes(date_pattern)) {
            // direct replace without moment for non-moment-pattern
            pattern = pattern.replace(date_pattern, replacer[date_pattern]);
        }
        else {
            pattern = pattern.replace(date_pattern, (0, dateMapper_1.moment)(date).format(replacer[date_pattern]));
        }
    }
    // replace %20 to space
    const newPattern = pattern.replace(/%20/g, ' ');
    const result = newPattern.replace(/\/{2,10}/g, '/').replace(config.url, '');
    (0, debug_1.default)('permalink').extend('result')(result);
    return result;
}
exports.parsePermalink = parsePermalink;
//# sourceMappingURL=parsePermalink.js.map