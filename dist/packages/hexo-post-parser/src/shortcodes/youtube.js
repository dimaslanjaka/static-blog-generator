"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeYoutube = void 0;
var color_1 = __importDefault(require("../node/color"));
var _config_1 = __importDefault(require("../types/_config"));
/* eslint-disable no-useless-escape */
var regex = /\{\%\s+youtube\s+(.*)\s+\%\}/gm;
var logname = color_1.default['Vivid Tangerine']('[youtube]');
function shortcodeYoutube(content) {
    var m;
    var count = 0;
    var _loop_1 = function () {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        count++;
        var split = m[1].split(' ').map(function (s) { return s.trim(); });
        var ytid = split[0];
        var allmatch = m[0];
        //console.log(split[1]);
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
            // https://flaviocopes.com/responsive-youtube-videos/
            html = "\n<div class=\"video-container\">\n  <iframe src=\"".concat(src, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" loading=\"lazy\" allowfullscreen=\"true\"></iframe>\n</div>\n    ").trim();
        }
        console.log("".concat(logname, " transformed id ").concat(ytid, " type ").concat(type));
        content = content.replace(allmatch, function () { return html; });
    };
    while ((m = regex.exec(content)) !== null) {
        _loop_1();
    }
    return content;
}
exports.shortcodeYoutube = shortcodeYoutube;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieW91dHViZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL3Nob3J0Y29kZXMveW91dHViZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBa0M7QUFDbEMsNkRBQXNDO0FBRXRDLHNDQUFzQztBQUN0QyxJQUFNLEtBQUssR0FBRyxnQ0FBZ0MsQ0FBQztBQUMvQyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUV0RCxTQUFnQixnQkFBZ0IsQ0FBQyxPQUFlO0lBQzlDLElBQUksQ0FBa0IsQ0FBQztJQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7O1FBR1osb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQy9CLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNuQjtRQUNELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUM7UUFDbkQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0Qix3QkFBd0I7UUFDeEIsSUFBSSxJQUFJLEdBQXlCLE9BQU8sQ0FBQztRQUN6QyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNaLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQUUsSUFBSSxHQUFHLFVBQVUsQ0FBQztTQUN0RDtRQUNELElBQUksR0FBRyxTQUFRLENBQUM7UUFDaEIsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3BCLEdBQUcsR0FBRyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7U0FDL0M7YUFBTSxJQUFJLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDOUIsR0FBRyxHQUFHLGlEQUFpRCxHQUFHLElBQUksQ0FBQztTQUNoRTtRQUVELElBQUksSUFBWSxDQUFDO1FBQ2pCLElBQUksT0FBTyxpQkFBTSxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksaUJBQU0sQ0FBQyxHQUFHLEVBQUU7WUFDakQsSUFBSSxHQUFHLCtDQUVTLEtBQUssZ0NBQ1gsSUFBSSx1SEFNZ0IsSUFBSSxpRkFLbkMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNSO2FBQU07WUFDTCxxREFBcUQ7WUFDckQsSUFBSSxHQUFHLDZEQUVJLEdBQUcsNktBRWYsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNSO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFHLE9BQU8sNkJBQW1CLElBQUksbUJBQVMsSUFBSSxDQUFFLENBQUMsQ0FBQztRQUM5RCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQzs7SUEvQ2xELE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLElBQUk7O0tBZ0R4QztJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUF2REQsNENBdURDIn0=