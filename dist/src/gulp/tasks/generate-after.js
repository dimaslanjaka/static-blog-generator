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
var safelink = new safelinkify_1.default.safelink({
    redirect: [
        'external_link' in _config_1.default &&
            'safelink' in _config_1.default['external_link'] &&
            'redirect' in _config_1.default['external_link']['safelink']
            ? _config_1.default['external_link']['safelink']['redirect']
            : null
    ],
    password: 'external_link' in _config_1.default &&
        'safelink' in _config_1.default['external_link'] &&
        'password' in _config_1.default['external_link']['safelink']
        ? _config_1.default['external_link']['safelink']['password']
        : null,
    type: 'external_link' in _config_1.default &&
        'safelink' in _config_1.default['external_link'] &&
        'type' in _config_1.default['external_link']['safelink']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYWZ0ZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1hZnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsc0RBQXNEO0FBQ3RELGdEQUEwQjtBQUMxQix5QkFBaUQ7QUFDakQsOENBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw0REFBc0M7QUFFdEMsc0RBQXdFO0FBQ3hFLDJEQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsMkRBQW9DO0FBQ3BDLHdEQUFrRDtBQUNsRCw2REFBaUU7QUFDakUsa0NBQTBDO0FBRTFDLElBQU0sUUFBUSxHQUFHLElBQUkscUJBQVcsQ0FBQyxRQUFRLENBQUM7SUFDeEMsUUFBUSxFQUFFO1FBQ1IsZUFBZSxJQUFJLGlCQUFNO1lBQ3pCLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQztZQUNyQyxVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDL0MsQ0FBQyxDQUFDLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2pELENBQUMsQ0FBQyxJQUFJO0tBQ1Q7SUFDRCxRQUFRLEVBQ04sZUFBZSxJQUFJLGlCQUFNO1FBQ3pCLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQztRQUNyQyxVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDL0MsQ0FBQyxDQUFDLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxJQUFJO0lBQ1YsSUFBSSxFQUNGLGVBQWUsSUFBSSxpQkFBTTtRQUN6QixVQUFVLElBQUksaUJBQU0sQ0FBQyxl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