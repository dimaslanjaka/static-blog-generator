import color from '../node/color';
import { getConfig } from '../types/_config';

/* eslint-disable no-useless-escape */
const regex = /\{\%\s+youtube\s+(.*)\s+\%\}/gm;
const logname = color['Vivid Tangerine']('[youtube]');

/**
 * Parse shortcode youtube
 * * `{% youtube video_id [type] [cookie] %}` will compiled to `<div class="video-container"><iframe src="youtube url"></iframe></div>`
 */
export function shortcodeYoutube(content: string) {
  const config = getConfig();
  const { verbose, amp } = config.generator;
  let m: RegExpExecArray;
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
    let type: 'video' | 'playlist' = 'video';
    if (split[1]) {
      if (split[1].includes('playlist')) type = 'playlist';
    }
    let src: string;
    if (type === 'video') {
      src = 'https://www.youtube.com/embed/' + ytid;
    } else if (type === 'playlist') {
      src = 'https://www.youtube.com/embed/videoseries?list=' + ytid;
    }

    let html: string;
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
    } else {
      // https://flaviocopes.com/responsive-youtube-videos/
      html = `
<div class="video-container">
  <iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen="true"></iframe>
</div>
    `.trim();
    }
    if (verbose) console.log(`${logname} transformed id ${ytid} type ${type}`);
    content = content.replace(allmatch, () => html);
  }

  return content;
}
