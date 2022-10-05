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
    password: 'external_link' in _config_1.default && typeof _config_1.default['external_link'] == 'object' &&
        'safelink' in _config_1.default['external_link'] &&
        'password' in _config_1.default['external_link']['safelink']
        ? _config_1.default['external_link']['safelink']['password']
        : null,
    type: 'external_link' in _config_1.default && typeof _config_1.default['external_link'] == 'object' &&
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYWZ0ZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1hZnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsc0RBQXNEO0FBQ3RELGdEQUEwQjtBQUMxQix5QkFBaUQ7QUFDakQsOENBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw0REFBc0M7QUFFdEMsc0RBQXdFO0FBQ3hFLDJEQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsMkRBQW9DO0FBQ3BDLHdEQUFrRDtBQUNsRCw2REFBaUU7QUFDakUsa0NBQTBDO0FBRTFDLElBQU0sUUFBUSxHQUFHLElBQUkscUJBQVcsQ0FBQyxRQUFRLENBQUM7SUFDeEMsUUFBUSxFQUFFO1FBQ1IsZUFBZSxJQUFJLGlCQUFNO1lBQ3pCLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQztZQUNyQyxVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDL0MsQ0FBQyxDQUFDLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2pELENBQUMsQ0FBQyxJQUFJO0tBQ1Q7SUFDRCxRQUFRLEVBQ04sZUFBZSxJQUFJLGlCQUFNLElBQUksT0FBTyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFFBQVE7UUFDdkUsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3JDLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUMvQyxDQUFDLENBQUMsaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDakQsQ0FBQyxDQUFDLElBQUk7SUFDVixJQUFJLEVBQ0YsZUFBZSxJQUFJLGlCQUFNLElBQUksT0FBTyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFFBQVE7UUFDdkUsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUMzQyxDQUFDLENBQUMsaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDN0MsQ0FBQyxDQUFDLElBQUk7Q0FDWCxDQUFDLENBQUM7QUFFSDs7OztHQUlHO0FBQ0ksSUFBTSx5QkFBeUIsR0FBRyxVQUFDLEdBQWlCO0lBQ3pELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbEQsT0FBTyxRQUFRO1NBQ1osS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNSLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBUFcsUUFBQSx5QkFBeUIsNkJBT3BDO0FBRUYsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsSUFBTSxjQUFjLEdBQUcsSUFBQSwrQkFBaUIseUNBQ25DLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTztJQUNsQyxPQUFPLENBQUMsSUFBSTtJQUNaLHNCQUFzQjtJQUN0QixpQ0FBaUM7SUFDakMsZ0JBQWdCO0lBQ2hCLHdCQUF3QjtVQUN4QixDQUFDO0FBRUg7Ozs7R0FJRztBQUNILFNBQWdCLHFCQUFxQixDQUFDLElBQVksRUFBRSxLQUFhO0lBQWIsc0JBQUEsRUFBQSxhQUFhO0lBQy9ELElBQU0sTUFBTSxHQUFHO1FBQ2I7O1dBRUc7UUFDSCxRQUFRLEVBQUUsSUFBSTtRQUNkOztXQUVHO1FBQ0gsSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDM0IsMkJBQTJCO1FBQzNCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNqRDs7V0FFRztRQUNILElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQU0sVUFBVSxHQUNkLElBQUEsc0JBQU8sRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUscUNBQXFDLENBQUM7WUFDM0QsQ0FBQyxVQUFVLENBQUM7UUFDZCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFNLFNBQVMsR0FBRyxVQUFVLElBQUksUUFBUSxDQUFDO1FBQ3pDLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsWUFBQSxFQUFFLFVBQVUsWUFBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLElBQUksTUFBQSxFQUFFLENBQUMsQ0FBQztTQUMxRDtRQUVELGdCQUFnQjtRQUNoQixJQUFJLFNBQVMsRUFBRTtZQUNiLHlDQUF5QztZQUN6QyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFO2dCQUNyRCxJQUFJLENBQUMsSUFBQSxzQkFBYyxFQUFDLElBQUksQ0FBQyxFQUFFO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUNULFdBQUksZUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBSSxlQUFLLENBQUMsS0FBSyxDQUMxQyxVQUFVLENBQ1gsa0JBQWUsRUFDaEIsZUFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDOUIsQ0FBQztvQkFDRixNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDdkIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ3BCO3FCQUFNO29CQUNMOzt1QkFFRztvQkFDSCxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5RDs7dUJBRUc7b0JBQ0gsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7b0JBQzVCLElBQUksS0FBSyxFQUFFO3dCQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzNDO29CQUNELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEVBQUU7d0JBQzVCLElBQU0sY0FBYyxHQUFHLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQzNELGlCQUFpQjt3QkFDakIsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFOzRCQUN6QixJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLE9BQU8sWUFBWSxJQUFJLFFBQVEsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDOUQsTUFBTSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7NkJBQzVCO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXBFRCxzREFvRUM7QUFFRCxTQUFnQixvQkFBb0IsQ0FBQyxJQUFrQjtJQUNyRCxvREFBb0Q7SUFDcEQsSUFBQSxxQkFBTyxFQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSw0QkFBa0IsRUFBRSxDQUFDO1NBQzlDLEdBQUcsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUEsV0FBSSxFQUFDLDRCQUFrQixFQUFFLElBQUksQ0FBQyxFQUE5QixDQUE4QixDQUFDO1NBQzdDLElBQUksQ0FBQyxVQUFDLEtBQUs7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFBLHFCQUFhLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVJELG9EQVFDO0FBQ0QsY0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBRWxEOzs7OztHQUtHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQ2hDLEdBQVcsRUFDWCxXQUFvRTtJQUFwRSw0QkFBQSxFQUFBLG9FQUFvRTtJQUVwRSxJQUFNLEtBQUssR0FBRyxnQ0FBZ0MsQ0FBQztJQUMvQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFORCxnREFNQztBQUVELElBQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztBQUMzQjs7Ozs7R0FLRztBQUNJLElBQU0sYUFBYSxHQUFHLFVBQzNCLE9BQWtCLEVBQ2xCLFFBQTJCO0lBRTNCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNO1FBQUUsSUFBQSx5QkFBVyxFQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxJQUFNLElBQUksR0FBRztRQUNYLDJEQUEyRDtRQUMzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2Qsc0RBQXNEO1lBQ3RELE9BQU8sSUFBQSxxQkFBYSxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN0QzthQUFNLElBQUksT0FBTyxRQUFRLElBQUksVUFBVSxFQUFFO1lBQ3hDLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVTtnQkFBRSxPQUFPLFFBQVEsRUFBRSxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUVqQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsSUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBWSxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1QyxJQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsSUFBQSxrQkFBYSxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QixPQUFPLElBQUksRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQXRCVyxRQUFBLGFBQWEsaUJBc0J4QjtBQUVGOzs7O0dBSUc7QUFDSCxTQUF3QixXQUFXLENBQUMsT0FBZSxFQUFFLEtBQWE7SUFBYixzQkFBQSxFQUFBLGFBQWE7SUFDaEUsSUFBTSxFQUFFLEdBQUcsSUFBSSxlQUFJLEVBQUUsQ0FBQztJQUN0QixJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLGdCQUFnQjtJQUNoQixJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSx1QkFBdUI7SUFDdkIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLElBQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRCxJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO29CQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3pEO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLDZCQUE2QixDQUFDLENBQUM7Z0JBQzNELE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzFDO1lBRUQsSUFBSSxlQUFlLElBQUksaUJBQU07Z0JBQzNCLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxJQUFJO29CQUNsQyxJQUFJLFVBQVUsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQzt3QkFDdkMsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQzs0QkFDckMsSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUk7Z0NBQ3hELE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyRDtLQUNGO0lBRUQsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzlCLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQWhDRCw4QkFnQ0MifQ==