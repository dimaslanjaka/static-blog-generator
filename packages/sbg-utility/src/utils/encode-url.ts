import { unescape } from 'querystring';
import { format, parse } from 'url';

/**
 * Encodes a URL, ensuring spaces in query parameters are encoded as '%20' instead of '+'.
 * @param str - The URL or path to encode.
 * @returns The encoded URL or path.
 */
const encodeURL = (str: string): string => {
  if (parse(str).protocol) {
    const parsed = new URL(str);

    // Exit if input is a data url
    if (parsed.origin === 'null') return str;

    // Encode search params, replacing + with %20
    if (parsed.search) {
      const params = new URLSearchParams(parsed.search);
      // Manually encode each param value to ensure %20 for spaces
      const search = Array.from(params.entries())
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      parsed.search = search ? `?${search}` : '';
    }

    parsed.pathname = encodeURI(decodeURI(parsed.pathname));
    // preserve IDN
    return format(parsed, { unicode: true });
  }

  return encodeURI(unescape(str));
};

export { encodeURL };
export default encodeURL;
