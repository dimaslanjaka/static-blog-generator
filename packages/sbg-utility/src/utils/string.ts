// https://raw.githubusercontent.com/dimaslanjaka/chimeraland/master/src/utils/string.ts
// https://github.com/dimaslanjaka/chimeraland/tree/master/src/utils

import { normalizePath } from './filemanager';

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
  return normalizePath(source).replace(normalizePath(toReplace), replacement);
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

export interface CleanStringOptions {
  /** Collapse multiple whitespaces into one. Default: true */
  collapseWhitespace?: boolean;
  /** Keep zero-width characters (if false, removes them). Default: false */
  keepZeroWidth?: boolean;
  /** Convert string to lowercase. Default: false */
  toLowerCase?: boolean;
  /** Remove zero-width characters (\u200B-\u200D, \uFEFF). Default: false */
  removeZeroWidth?: boolean;
  /** Keep only letters, numbers, and spaces. Default: false */
  keepAlphaNumSpace?: boolean;
}

/**
 * Cleans a string with configurable options.
 *
 * @param str - The input string to clean.
 * @param options - Cleaning options.
 * @returns The cleaned string.
 *
 * @remarks
 * - If `removeZeroWidth` is true, removes zero-width characters (\u200B-\u200D, \uFEFF).
 * - If `keepAlphaNumSpace` is true, keeps only letters, numbers, and spaces.
 * - If `collapseWhitespace` is true, collapses multiple whitespaces into one.
 * - If `toLowerCase` is true, converts string to lowercase.
 * - If `keepZeroWidth` is false, removes zero-width characters.
 */
export function cleanString(str: string, options: CleanStringOptions = {}): string {
  const defaultOptions: Required<CleanStringOptions> = {
    collapseWhitespace: true,
    keepZeroWidth: false,
    toLowerCase: false,
    removeZeroWidth: false,
    keepAlphaNumSpace: false
  };
  options = { ...defaultOptions, ...options };
  if (options.removeZeroWidth) {
    str = str.replace(/[\u200B-\u200D\uFEFF]/g, '');
  }
  if (options.keepAlphaNumSpace) {
    str = str.replace(/[^\p{L}\p{N}\s]/gu, '');
  }
  if (options.collapseWhitespace) {
    str = str.replace(/\s+/g, ' ');
  }
  if (options.toLowerCase) {
    str = str.toLowerCase();
  }
  if (!options.keepZeroWidth) {
    str = str.replace(/[\u200B-\u200D\uFEFF]/g, '');
  }
  return str.trim();
}
