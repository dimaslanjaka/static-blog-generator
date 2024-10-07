// https://raw.githubusercontent.com/dimaslanjaka/chimeraland/master/src/utils/string.ts
// https://github.com/dimaslanjaka/chimeraland/tree/master/src/utils

/**
 * escape regex string
 * @param string
 * @returns
 */
export function escapeRegex(string: string, method: '1' | '2' = '1') {
  if (method === '1' || !method) return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  if (method === '2') return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

/**
 * capitalize string first letter of each word which mixed with symbols
 * @param str
 * @param moreSymbols add more symbols, default []
 * @returns
 */
export function capitalize(str: string, moreSymbols: ConcatArray<string> = []) {
  let symbols = ['-', ' '];
  if (Array.isArray(moreSymbols)) {
    // concatenate more symbols
    symbols = [...new Set(symbols.concat(moreSymbols))];
  }
  symbols.forEach((symbol) => {
    str = str
      .split(symbol)
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(symbol);
  });
  return str;
}

export const capitalizer = capitalize;

/**
 * Stream to string
 * @param stream
 * @returns
 */
export function streamToString(stream: NodeJS.ReadableStream) {
  const chunks: Uint8Array[] | Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

/**
 * Buffer to string
 * @param array
 * @returns
 */
export function bufferToString(array: Buffer) {
  if (typeof Uint8Array !== 'undefined' && typeof TextDecoder !== 'undefined') {
    const td = new TextDecoder();
    const ua = new Uint8Array(array);
    return td.decode(ua);
  } else {
    return array.toString();
  }
}

/**
 * Replace path unix-style
 * @param source
 * @param toReplace
 * @param replacement
 * @returns
 */
export async function replacePath(source: string, toReplace: string, replacement = '') {
  const upath = await import('upath');
  return upath.toUnix(source).replace(upath.toUnix(toReplace), replacement);
}

/**
 * slugify string
 * @param str
 * @param ext
 * @returns
 */
export function slugify(str: string, ext?: string) {
  return (
    (
      str
        // lower case
        .toLowerCase()
        // remove special char except space, underscore, alphabetic, number
        .replace(/[^a-zA-Z0-9\s+\-_]/g, '')
        // replace whitespaces and underscore with single hypens
        .replace(/[\s\-_]+/g, '-')
        // replace multiple hypens with single hypens
        .replace(/-+/g, '-') + (ext || '')
    ).trim()
  );
}

/**
 * check variable is valid http(s) url string
 * @param string string url to validate
 * @returns
 */
export function isValidHttpUrl(string: string | URL) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
