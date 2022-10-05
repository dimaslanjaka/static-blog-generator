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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAfterGen = exports.removeWordpressCDN = exports.safelinkifyGenerated = exports.filter_external_links = exports.getDomainWithoutSubdomain = void 0;
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var path_1 = require("path");
var safelinkify_1 = __importDefault(require("safelinkify"));
var array_utils_1 = require("../../node/array-utils");
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var jsdom_1 = __importDefault(require("../../node/jsdom"));
var string_utils_1 = require("../../node/string-utils");
var _config_1 = __importStar(require("../../types/_config"));
var utils_1 = require("../utils");
var isSafelinkSet = 'external_link' in _config_1.default &&
    typeof _config_1.default['external_link'] == 'object' &&
    'safelink' in _config_1.default['external_link'];
var safelink = new safelinkify_1.default.safelink({
    redirect: [
        isSafelinkSet && 'redirect' in _config_1.default['external_link']['safelink']
            ? _config_1.default['external_link']['safelink']['redirect']
            : null
    ],
    password: isSafelinkSet && 'password' in _config_1.default['external_link']['safelink']
        ? _config_1.default['external_link']['safelink']['password']
        : null,
    type: isSafelinkSet && 'type' in _config_1.default['external_link']['safelink']
        ? _config_1.default['external_link']['safelink']['type']
        : null
});
/**
 * get domain name without subdomain
 * @param url
 * @returns
 */
var getDomainWithoutSubdomain = function (url) {
    var urlParts = new URL(url).hostname.split('.');
    return urlParts
        .slice(0)
        .slice(-(urlParts.length === 4 ? 3 : 2))
        .join('.');
};
exports.getDomainWithoutSubdomain = getDomainWithoutSubdomain;
var logname = chalk_1.default.magenta('[generate]') + chalk_1.default.blue('[after]');
var hexoURL = new URL(_config_1.default.url);
var internal_links = (0, array_utils_1.uniqueStringArray)(__spreadArray(__spreadArray([], __read(_config_1.default['external_link'].exclude), false), [
    hexoURL.host,
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    '/dimaslanjaka1',
    'dimaslanjaka.github.io'
], false));
/**
 * filter external links
 * @param href
 * @returns
 */
function filter_external_links(href, debug) {
    if (debug === void 0) { debug = false; }
    var result = {
        /**
         * is internal?
         */
        internal: true,
        /**
         * original link or safelink
         */
        href: href
    };
    if (href && href.length > 2) {
        // fix dynamic url protocol
        if (href.startsWith('//'))
            href = 'http:' + href;
        /**
         *  javascript anchors, dot anchors, hash header
         */
        var isExternal = href.trim().match(new RegExp('^(https?|ftp)://'));
        var isInternal = (0, string_utils_1.isMatch)(href.trim(), /^(\.+|#|(javascript|mailto|mail):)/i) &&
            !isExternal;
        var isLength = href.trim().length > 0;
        var isAllowed = isExternal && isLength;
        if (debug) {
            console.log({ isInternal: isInternal, isExternal: isExternal, isAllowed: isAllowed, href: href });
        }
        // skip hash and
        if (isAllowed) {
            // only get external links with protocols
            if (href.trim().match(new RegExp('^(https?|ftp)://'))) {
                if (!(0, utils_1.isValidHttpUrl)(href)) {
                    console.log("[".concat(color_1.default.yellow('marked as'), " ").concat(color_1.default.green('internal'), "] invalid url"), color_1.default.redBright(String(href)));
                    result.internal = true;
                    result.href = href;
                }
                else {
                    /**
                     * match host
                     */
                    var matchHost = internal_links.includes(new URL(href).host);
                    /**
                     * match url
                     */
                    var matchHref = internal_links.includes(href);
                    result.internal = matchHost;
                    if (debug) {
                        console.log(!matchHost, !matchHref, href);
                    }
                    if (!matchHost && !matchHref) {
                        var safelinkConfig = _config_1.default['external_link']['safelink'];
                        // apply safelink
                        if (safelinkConfig.enable) {
                            var safelinkPath = safelink.encodeURL(href);
                            if (typeof safelinkPath == 'string' && safelinkPath.length > 0) {
                                result.href = safelinkPath;
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
}
exports.filter_external_links = filter_external_links;
function safelinkifyGenerated(done) {
    // iterate public_dir of _config.yml (hexo generate)
    (0, filemanager_1.globSrc)('**/*.html', { cwd: _config_1.post_generated_dir })
        .map(function (file) { return (0, path_1.join)(_config_1.post_generated_dir, file); })
        .then(function (files) {
        console.log(logname, 'html files total', files.length);
        return (0, exports.parseAfterGen)(files, done);
    });
}
exports.safelinkifyGenerated = safelinkifyGenerated;
gulp_1.default.task('generate:after', safelinkifyGenerated);
/**
 * remove i2.wp.com i1.wp.com etc
 * @param str url string
 * @param replacement replacement string, default: https://res.cloudinary.com/practicaldev/image/fetch/
 * @returns
 */
function removeWordpressCDN(str, replacement) {
    if (replacement === void 0) { replacement = 'https://res.cloudinary.com/practicaldev/image/fetch/'; }
    var regex = /https?:\/\/i\d{1,4}.wp.com\//gm;
    return str.replace(regex, replacement);
}
exports.removeWordpressCDN = removeWordpressCDN;
var files = [];
/**
 * html fixer using queue method
 * @param sources insert once
 * @param callback callback after processed all files
 * @returns
 */
var parseAfterGen = function (sources, callback) {
    if (sources && sources.length)
        (0, array_utils_1.arrayAddAll)(files, sources);
    var skip = function () {
        // if files has members, shift first file, restart function
        if (files.length) {
            files.shift();
            //console.log(logname, 'remaining', files.length + 1);
            return (0, exports.parseAfterGen)(null, callback);
        }
        else if (typeof callback == 'function') {
            if (typeof callback === 'function')
                return callback();
        }
    };
    if (!files.length)
        return skip();
    var file = files[0];
    var content = (0, fs_1.readFileSync)(file, 'utf-8');
    var result = fixHtmlPost(content);
    (0, fs_1.writeFileSync)(file, result);
    return skip();
};
exports.parseAfterGen = parseAfterGen;
/**
 * fix html content (safelink, nofollow, etc) using JSDOM
 * @param content
 * @returns
 */
function fixHtmlPost(content, debug) {
    if (debug === void 0) { debug = false; }
    var jd = new jsdom_1.default();
    var dom = jd.parse(content);
    // fix lang attr
    var html = dom.querySelector('html');
    if (html && !html.hasAttribute('lang'))
        html.setAttribute('lang', 'en');
    // external link filter
    var hrefs = dom.querySelectorAll('a');
    if (hrefs && hrefs.length > 0) {
        for (var i = 0; i < hrefs.length; i++) {
            var element = hrefs[i];
            var href = element.getAttribute('href');
            var filter = filter_external_links(href, debug);
            if (debug) {
                if (href.includes('seoserp'))
                    console.log(filter, href);
            }
            if (!filter.internal) {
                element.setAttribute('rel', 'nofollow noopener noreferer');
                element.setAttribute('target', '_blank');
            }
            if ('external_link' in _config_1.default)
                if (_config_1.default['external_link'] !== null)
                    if ('safelink' in _config_1.default['external_link'])
                        if (_config_1.default['external_link']['safelink'])
                            if (_config_1.default['external_link']['safelink']['enable'] === true)
                                element.setAttribute('href', filter.href);
        }
    }
    var result = jd.serialize();
    return removeWordpressCDN(result);
}
exports.default = fixHtmlPost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYWZ0ZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1hZnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsc0RBQXNEO0FBQ3RELGdEQUEwQjtBQUMxQix5QkFBaUQ7QUFDakQsOENBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw0REFBc0M7QUFFdEMsc0RBQXdFO0FBQ3hFLDJEQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsMkRBQW9DO0FBQ3BDLHdEQUFrRDtBQUNsRCw2REFBaUU7QUFDakUsa0NBQTBDO0FBRTFDLElBQU0sYUFBYSxHQUNqQixlQUFlLElBQUksaUJBQU07SUFDekIsT0FBTyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFFBQVE7SUFDMUMsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFeEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxxQkFBVyxDQUFDLFFBQVEsQ0FBQztJQUN4QyxRQUFRLEVBQUU7UUFDUixhQUFhLElBQUksVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2hFLENBQUMsQ0FBQyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNqRCxDQUFDLENBQUMsSUFBSTtLQUNUO0lBQ0QsUUFBUSxFQUNOLGFBQWEsSUFBSSxVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDaEUsQ0FBQyxDQUFDLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxJQUFJO0lBQ1YsSUFBSSxFQUNGLGFBQWEsSUFBSSxNQUFNLElBQUks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