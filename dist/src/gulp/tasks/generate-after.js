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
        var isExternal = href.trim().match(new RegExp('^(https?)://'));
        var isInternal = (0, string_utils_1.isMatch)(href.trim(), /^(\.+|#|(javascript|mailto|mail):)/i) &&
            !isExternal;
        var isLength = href.trim().length > 0;
        var isAllowed = isExternal && isLength;
        if (debug) {
            console.log(isInternal, isExternal, isAllowed, href);
        }
        // skip hash and
        if (isAllowed) {
            // only get external links with protocols
            if (href.trim().match(new RegExp('^(https?|ftp)://'))) {
                if (!(0, utils_1.isValidHttpUrl)(href)) {
                    console.log('invalid url', color_1.default.redBright(href));
                    return;
                }
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
    return result;
}
exports.filter_external_links = filter_external_links;
var generated_dir = (0, path_1.join)(_config_1.root, _config_1.default.public_dir);
function safelinkifyGenerated(done) {
    // iterate public_dir of _config.yml (hexo generate)
    (0, filemanager_1.globSrc)('**/*.html', { cwd: generated_dir })
        .map(function (file) { return (0, path_1.join)(generated_dir, file); })
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
    var debug = false; //strMatch(file, 'see-blog-position-in-search');
    var result = fixHtmlPost(content, debug);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYWZ0ZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1hZnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsc0RBQXNEO0FBQ3RELGdEQUEwQjtBQUMxQix5QkFBaUQ7QUFDakQsOENBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw0REFBc0M7QUFFdEMsc0RBQXdFO0FBQ3hFLDJEQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsMkRBQW9DO0FBQ3BDLHdEQUFrRDtBQUNsRCw2REFBbUQ7QUFDbkQsa0NBQTBDO0FBRTFDLElBQU0sUUFBUSxHQUFHLElBQUkscUJBQVcsQ0FBQyxRQUFRLENBQUM7SUFDeEMsUUFBUSxFQUFFO1FBQ1IsZUFBZSxJQUFJLGlCQUFNO1lBQ3pCLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQztZQUNyQyxVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDL0MsQ0FBQyxDQUFDLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2pELENBQUMsQ0FBQyxJQUFJO0tBQ1Q7SUFDRCxRQUFRLEVBQ04sZUFBZSxJQUFJLGlCQUFNO1FBQ3pCLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQztRQUNyQyxVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDL0MsQ0FBQyxDQUFDLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxJQUFJO0lBQ1YsSUFBSSxFQUNGLGVBQWUsSUFBSSxpQkFBTTtRQUN6QixVQUFVLElBQUksaUJBQU0sQ0FBQyxl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