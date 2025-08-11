import { unescape } from 'querystring';
import { format, parse } from 'url';

const decodeURL = (str: string) => {
  if (parse(str).protocol) {
    const parsed = new URL(str);

    // Exit if input is a data url
    if (parsed.origin === 'null') return str;

    const url = format(parsed, { unicode: true });
    return unescape(url);
  }

  return unescape(str);
};

export { decodeURL };
export default decodeURL;
