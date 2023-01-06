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
exports.shortcodeYoutube = void 0;
var color_1 = __importDefault(require("../node/color"));
var _config_1 = __importStar(require("../types/_config"));
var regex = /\{\%\s+youtube\s+(.*)\s+\%\}/gm;
var logname = color_1.default['Vivid Tangerine']('[youtube]');
function shortcodeYoutube(content) {
    var m;
    var count = 0;
    var _loop_1 = function () {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        count++;
        var split = m[1].split(' ').map(function (s) { return s.trim(); });
        var ytid = split[0];
        var allmatch = m[0];
        var type = 'video';
        if (split[1]) {
            if (split[1].includes('playlist'))
                type = 'playlist';
        }
        var src = void 0;
        if (type === 'video') {
            src = 'https://www.youtube.com/embed/' + ytid;
        }
        else if (type === 'playlist') {
            src = 'https://www.youtube.com/embed/videoseries?list=' + ytid;
        }
        var html;
        if (typeof _config_1.default.amp === 'boolean' && _config_1.default.amp) {
            html = "\n<amp-youtube\nid=\"video-container-".concat(count, "\"\ndata-videoid=\"").concat(ytid, "\"\nwidth=\"480\"\nheight=\"270\"\nlayout=\"responsive\"\n>\n<amp-img\n  src=\"https://img.youtube.com/vi/").concat(ytid, "/sddefault.jpg\"\n  placeholder\n  layout=\"fill\"\n/>\n</amp-youtube>\n    ").trim();
        }
        else {
            html = "\n<div class=\"video-container\">\n  <iframe src=\"".concat(src, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" loading=\"lazy\" allowfullscreen=\"true\"></iframe>\n</div>\n    ").trim();
        }
        if (_config_1.verbose)
            console.log("".concat(logname, " transformed id ").concat(ytid, " type ").concat(type));
        content = content.replace(allmatch, function () { return html; });
    };
    while ((m = regex.exec(content)) !== null) {
        _loop_1();
    }
    return content;
}
exports.shortcodeYoutube = shortcodeYoutube;
