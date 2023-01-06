"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermalink = void 0;
var dateMapper_1 = require("./dateMapper");
var _config_1 = __importDefault(require("./types/_config"));
function parsePermalink(post) {
    var pattern = _config_1.default.permalink;
    var date = (0, dateMapper_1.moment)(post.metadata.date);
    var url = post.metadata.url.replace(_config_1.default.url, '');
    var replacer = {
        ':month': 'MM',
        ':year': 'YYYY',
        ':day': 'DD',
        ':i_month': 'M',
        ':hour': 'HH',
        ':minute': 'mm',
        ':second': 'ss',
        ':title': url.replace(/.(md|html)$/, ''),
        ':post_title': post.metadata.title
    };
    for (var date_pattern in replacer) {
        if (Object.prototype.hasOwnProperty.call(replacer, date_pattern)) {
            if ([':title', ':post_title', ':id', ':category', ':hash'].includes(date_pattern)) {
                pattern = pattern.replace(date_pattern, replacer[date_pattern]);
            }
            else {
                pattern = pattern.replace(date_pattern, date.format(replacer[date_pattern]));
            }
        }
    }
    var newPattern = pattern.replace(/%20/g, ' ');
    if (/^https?:\/\//.test(newPattern))
        return newPattern;
    var result = newPattern.replace(/\/{2,10}/g, '/');
    return result;
}
exports.parsePermalink = parsePermalink;
