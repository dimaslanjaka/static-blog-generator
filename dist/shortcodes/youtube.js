"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeYoutube = void 0;
const color_1 = __importDefault(require("../node/color"));
const _config_1 = require("../types/_config");
/* eslint-disable no-useless-escape */
const regex = /\{\%\s+youtube\s+(.*)\s+\%\}/gm;
const logname = color_1.default['Vivid Tangerine']('[youtube]');
/**
 * Parse shortcode youtube
 * * `{% youtube video_id [type] [cookie] %}` will compiled to `<div class="video-container"><iframe src="youtube url"></iframe></div>`
 */
function shortcodeYoutube(content) {
    const config = (0, _config_1.getConfig)();
    const { verbose, amp } = config.generator;
    let m;
    let count = 0;
    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        count++;
        const split = m[1].split(' ').map((s) => s.trim());
        const ytid = split[0];
        const allmatch = m[0];
        //console.log(split[1]);
        let type = 'video';
        if (split[1]) {
            if (split[1].includes('playlist'))
                type = 'playlist';
        }
        let src;
        if (type === 'video') {
            src = 'https://www.youtube.com/embed/' + ytid;
        }
        else if (type === 'playlist') {
            src = 'https://www.youtube.com/embed/videoseries?list=' + ytid;
        }
        let html;
        if (amp === true) {
            html = `
<amp-youtube
id="video-container-${count}"
data-videoid="${ytid}"
width="480"
height="270"
layout="responsive"
>
<amp-img
  src="https://img.youtube.com/vi/${ytid}/sddefault.jpg"
  placeholder
  layout="fill"
/>
</amp-youtube>
    `.trim();
        }
        else {
            // https://flaviocopes.com/responsive-youtube-videos/
            html = `
<div class="video-container">
  <iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen="true"></iframe>
</div>
    `.trim();
        }
        if (verbose)
            console.log(`${logname} transformed id ${ytid} type ${type}`);
        content = content.replace(allmatch, () => html);
    }
    return content;
}
exports.shortcodeYoutube = shortcodeYoutube;
//# sourceMappingURL=youtube.js.map