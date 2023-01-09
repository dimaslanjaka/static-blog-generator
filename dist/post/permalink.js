"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermalink = void 0;
var moment_timezone_1 = __importStar(require("moment-timezone"));
var true_case_path_1 = require("true-case-path");
var path = __importStar(require("upath"));
var debug_1 = __importDefault(require("../utils/debug"));
var _config_1 = require("../_config");
var moment = function (input) {
    moment_timezone_1.tz.setDefault((0, _config_1.getConfig)().timezone || 'UTC');
    return (0, moment_timezone_1.default)(input).tz((0, _config_1.getConfig)().timezone || 'UTC');
};
var normalizePath = function (str) { return path.toUnix((0, true_case_path_1.trueCasePathSync)(str)); };
function parsePermalink(post, config) {
    (0, debug_1.default)('permalink').extend('source')(post);
    var siteConfig = (0, _config_1.getConfig)();
    var pattern = config.permalink_pattern || siteConfig.permalink;
    var date = config.date;
    var cleanPathname = normalizePath(post).replace(/.md$/, '');
    var toReplace = [
        normalizePath(process.cwd()),
        siteConfig.source_dir + '/_posts/',
        "".concat(siteConfig.post_dir || 'src-posts', "/"),
        '_posts/'
    ];
    for (var i = 0; i < toReplace.length; i++) {
        var str = toReplace[i];
        cleanPathname = cleanPathname
            .replace(str, '/')
            .replace(/\/+/, '/')
            .replace(/^\/+/, '/');
    }
    var replacer = {
        ':month': 'MM',
        ':year': 'YYYY',
        ':day': 'DD',
        ':i_month': 'M',
        ':hour': 'HH',
        ':minute': 'mm',
        ':second': 'ss',
        ':title': cleanPathname,
        ':name': path.basename(cleanPathname),
        ':post_title': config.title
    };
    if (pattern.startsWith(':title')) {
        var bname = pattern.replace(':title', replacer[':title']);
        var perm = path.join(path.dirname(normalizePath(post)), bname);
        (0, debug_1.default)('permalink').extend('result')(perm);
        return perm;
    }
    for (var date_pattern in replacer) {
        if ([':title', ':post_title', ':id', ':category', ':hash', ':name'].includes(date_pattern)) {
            pattern = pattern.replace(date_pattern, replacer[date_pattern]);
        }
        else {
            pattern = pattern.replace(date_pattern, moment(date).format(replacer[date_pattern]));
        }
    }
    var newPattern = pattern.replace(/%20/g, ' ');
    var result = newPattern.replace(/\/{2,10}/g, '/').replace(config.url, '');
    (0, debug_1.default)('permalink').extend('result')(result);
    return result;
}
exports.parsePermalink = parsePermalink;
