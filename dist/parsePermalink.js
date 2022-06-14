"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermalink = void 0;
const tslib_1 = require("tslib");
const upath_1 = require("upath");
const dateMapper_1 = require("./dateMapper");
const _config_1 = tslib_1.__importDefault(require("./types/_config"));
/**
 * transform permalink format in `_config.yml`
 * @param post
 */
function parsePermalink(post) {
    let pattern = _config_1.default.permalink;
    const date = (0, dateMapper_1.moment)(post.metadata.date);
    const url = post.metadata.url.replace(_config_1.default.url, '');
    const replacer = {
        ':month': 'MM',
        ':year': 'YYYY',
        ':day': 'DD',
        ':i_month': 'M',
        ':hour': 'HH',
        ':minute': 'mm',
        ':second': 'ss',
        ':title': (0, upath_1.basename)(url).replace(/.(md|html)$/, ''),
        ':post_title': post.metadata.title
    };
    // @todo [permalink] follow directory path
    if (pattern.startsWith(':title')) {
        const bname = pattern.replace(':title', replacer[':title']);
        const perm = (0, upath_1.join)((0, upath_1.dirname)(url), bname);
        //console.log(perm);
        return perm;
    }
    for (const date_pattern in replacer) {
        if (Object.prototype.hasOwnProperty.call(replacer, date_pattern)) {
            if ([':title', ':post_title', ':id', ':category', ':hash'].includes(date_pattern)) {
                pattern = pattern.replace(date_pattern, replacer[date_pattern]);
            }
            else {
                pattern = pattern.replace(date_pattern, date.format(replacer[date_pattern]));
            }
        }
    }
    return pattern;
}
exports.parsePermalink = parsePermalink;
//# sourceMappingURL=parsePermalink.js.map