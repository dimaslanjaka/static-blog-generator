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
exports.parseAfterGen = exports.removeWordpressCDN = exports.staticAfter = exports.filter_external_links = exports.getDomainWithoutSubdomain = void 0;
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var path_1 = require("path");
var safelinkify_1 = __importDefault(require("safelinkify"));
var array_utils_1 = require("../../node/array-utils");
var filemanager_1 = require("../../node/filemanager");
var jsdom_1 = __importDefault(require("../../node/jsdom"));
var string_utils_1 = require("../../node/string-utils");
var _config_1 = __importStar(require("../../types/_config"));
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
        // fix dynamic protocol urls
        var homepage = new URL(_config_1.default.url);
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
function staticAfter(done) {
    // iterate public_dir of _config.yml (hexo generate)
    (0, filemanager_1.globSrc)('**/*.html', { cwd: generated_dir })
        .map(function (file) { return (0, path_1.join)(generated_dir, file); })
        .then(function (files) {
        console.log(logname, 'html files total', files.length);
        return (0, exports.parseAfterGen)(files, done);
    });
}
exports.staticAfter = staticAfter;
gulp_1.default.task('generate:after', staticAfter);
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
            if ('external_link' in _config_1.default &&
                typeof _config_1.default['external_link'] == 'object' &&
                'safelink' in _config_1.default['external_link'] &&
                _config_1.default['external_link']['safelink'] &&
                _config_1.default['external_link']['safelink']['enable']) {
                element.setAttribute('href', filter.href);
            }
        }
    }
    var result = jd.serialize();
    return removeWordpressCDN(result);
}
exports.default = fixHtmlPost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYWZ0ZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1hZnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsc0RBQXNEO0FBQ3RELGdEQUEwQjtBQUMxQix5QkFBaUQ7QUFDakQsOENBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw0REFBc0M7QUFFdEMsc0RBQXdFO0FBQ3hFLHNEQUFpRDtBQUNqRCwyREFBb0M7QUFDcEMsd0RBQWtEO0FBQ2xELDZEQUFtRDtBQUVuRCxJQUFNLFFBQVEsR0FBRyxJQUFJLHFCQUFXLENBQUMsUUFBUSxDQUFDO0lBQ3hDLFFBQVEsRUFBRTtRQUNSLGVBQWUsSUFBSSxpQkFBTTtZQUN6QixVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUM7WUFDckMsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQy9DLENBQUMsQ0FBQyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNqRCxDQUFDLENBQUMsSUFBSTtLQUNUO0lBQ0QsUUFBUSxFQUNOLGVBQWUsSUFBSSxpQkFBTTtRQUN6QixVQUFVLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUM7UUFDckMsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQy9DLENBQUMsQ0FBQyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNqRCxDQUFDLENBQUMsSUFBSTtJQUNWLElBQUksRUFDRixlQUFlLElBQUksaUJBQU07UUFDekIsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUMzQyxDQUFDLENBQUMsaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDN0MsQ0FBQyxDQUFDLElBQUk7Q0FDWCxDQUFDLENBQUM7QUFFSDs7OztHQUlHO0FBQ0ksSUFBTSx5QkFBeUIsR0FBRyxVQUFDLEdBQWlCO0lBQ3pELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbEQsT0FBTyxRQUFRO1NBQ1osS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNSLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBUFcsUUFBQSx5QkFBeUIsNkJBT3BDO0FBRUYsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsSUFBTSxjQUFjLEdBQUcsSUFBQSwrQkFBaUIseUNBQ25DLGlCQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTztJQUNsQyxPQUFPLENBQUMsSUFBSTtJQUNaLHNCQUFzQjtJQUN0QixpQ0FBaUM7SUFDakMsZ0JBQWdCO0lBQ2hCLHdCQUF3QjtVQUN4QixDQUFDO0FBRUg7Ozs7R0FJRztBQUNILFNBQWdCLHFCQUFxQixDQUFDLElBQVksRUFBRSxLQUFhO0lBQWIsc0JBQUEsRUFBQSxhQUFhO0lBQy9ELElBQU0sTUFBTSxHQUFHO1FBQ2I7O1dBRUc7UUFDSCxRQUFRLEVBQUUsSUFBSTtRQUNkOztXQUVHO1FBQ0gsSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDM0IsNEJBQTRCO1FBQzVCLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsMkJBQTJCO1FBQzNCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNqRDs7V0FFRztRQUNILElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFNLFVBQVUsR0FDZCxJQUFBLHNCQUFPLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLHFDQUFxQyxDQUFDO1lBQzNELENBQUMsVUFBVSxDQUFDO1FBQ2QsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBTSxTQUFTLEdBQUcsVUFBVSxJQUFJLFFBQVEsQ0FBQztRQUN6QyxJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdEQ7UUFFRCxnQkFBZ0I7UUFDaEIsSUFBSSxTQUFTLEVBQUU7WUFDYix5Q0FBeUM7WUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRTtnQkFDckQ7O21CQUVHO2dCQUNILElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlEOzttQkFFRztnQkFDSCxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztnQkFDNUIsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0M7Z0JBQ0QsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDNUIsSUFBTSxjQUFjLEdBQUcsaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0QsaUJBQWlCO29CQUNqQixJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUU7d0JBQ3pCLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzlDLElBQUksT0FBTyxZQUFZLElBQUksUUFBUSxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUM5RCxNQUFNLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQzt5QkFDNUI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBM0RELHNEQTJEQztBQUVELElBQU0sYUFBYSxHQUFHLElBQUEsV0FBSSxFQUFDLGNBQUksRUFBRSxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFNBQWdCLFdBQVcsQ0FBQyxJQUFrQjtJQUM1QyxvREFBb0Q7SUFDcEQsSUFBQSxxQkFBTyxFQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztTQUN6QyxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFBLFdBQUksRUFBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQXpCLENBQXlCLENBQUM7U0FDeEMsSUFBSSxDQUFDLFVBQUMsS0FBSztRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUEscUJBQWEsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBUkQsa0NBUUM7QUFDRCxjQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRXpDOzs7OztHQUtHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQ2hDLEdBQVcsRUFDWCxXQUFvRTtJQUFwRSw0QkFBQSxFQUFBLG9FQUFvRTtJQUVwRSxJQUFNLEtBQUssR0FBRyxnQ0FBZ0MsQ0FBQztJQUMvQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFORCxnREFNQztBQUVELElBQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztBQUMzQjs7Ozs7R0FLRztBQUNJLElBQU0sYUFBYSxHQUFHLFVBQzNCLE9BQWtCLEVBQ2xCLFFBQTJCO0lBRTNCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNO1FBQUUsSUFBQSx5QkFBVyxFQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxJQUFNLElBQUksR0FBRztRQUNYLDJEQUEyRDtRQUMzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2Qsc0RBQXNEO1lBQ3RELE9BQU8sSUFBQSxxQkFBYSxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN0QzthQUFNLElBQUksT0FBTyxRQUFRLElBQUksVUFBVSxFQUFFO1lBQ3hDLE9BQU8sUUFBUSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFBRSxPQUFPLElBQUksRUFBRSxDQUFDO0lBRWpDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixJQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFZLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLGdEQUFnRDtJQUNyRSxJQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLElBQUEsa0JBQWEsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUIsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNoQixDQUFDLENBQUM7QUF2QlcsUUFBQSxhQUFhLGlCQXVCeEI7QUFFRjs7OztHQUlHO0FBQ0gsU0FBd0IsV0FBVyxDQUFDLE9BQWUsRUFBRSxLQUFhO0lBQWIsc0JBQUEsRUFBQSxhQUFhO0lBQ2hFLElBQU0sRUFBRSxHQUFHLElBQUksZUFBSSxFQUFFLENBQUM7SUFDdEIsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixnQkFBZ0I7SUFDaEIsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEUsdUJBQXVCO0lBQ3ZCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQyxJQUFNLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEQsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN6RDtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUNwQixPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMxQztZQUVELElBQ0UsZUFBZSxJQUFJLGlCQUFNO2dCQUN6QixPQUFPLGlCQUFNLENBQUMsZUFBZSxDQUFDLElBQUksUUFBUTtnQkFDMUMsVUFBVSxJQUFJLGlCQUFNLENBQUMsZUFBZSxDQUFDO2dCQUNyQyxpQkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFDbkMsaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDN0M7Z0JBQ0EsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7S0FDRjtJQUVELElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM5QixPQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFuQ0QsOEJBbUNDIn0=