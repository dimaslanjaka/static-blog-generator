import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import * as unicodeSymbols from '../../packages/unicode-symbols/source/index.js';

export async function fetchUnicodeData() {
  const instance = Axios.create();
  const axios = setupCache(instance);

  const url = 'https://www.unicode.org/Public/16.0.0/ucd/UnicodeData.txt';

  try {
    // fetch the file as text
    const response = await axios.get(url);
    const data = response.data as string;

    const unicodeMap = {};

    data.split('\n').forEach((line) => {
      if (!line || line.startsWith('#')) return; // skip empty or comments
      const fields = line.split(';');
      if (fields.length < 2) return;

      const codePoint = parseInt(fields[0], 16);
      const symbol = String.fromCodePoint(codePoint);

      unicodeMap[fields[1]] = {
        codePoint: 'U+' + fields[0],
        char: symbol,
        category: fields[2],
        name: fields[1]
      };
    });

    // Example usage
    // console.log(unicodeMap['LATIN CAPITAL LETTER A']);
    // { codePoint: 'U+0041', char: 'A', category: 'Lu', name: 'LATIN CAPITAL LETTER A' }

    return unicodeMap;
  } catch (err) {
    console.error('Failed to fetch UnicodeData:', (err as Error).message);
  }
}

/** Alias map for alternate symbol names */
const aliasMap: Record<string, string> = {
  check: 'tick',
  omega: 'ω', // Lowercase omega: \u03C9
  Omega: 'Ω' // Uppercase Omega: \u03A9
};

/**
 * Retrieves the Unicode symbol corresponding to the given name.
 * If the name is an alias, returns the mapped symbol or alias value.
 * Logs a warning if the symbol is not found.
 *
 * @param name - The name or alias of the Unicode symbol to retrieve.
 * @returns The Unicode symbol as a string, or undefined if not found.
 */
export function getUnicodeSymbolByName(name: string): string | undefined {
  const alias = aliasMap[name];
  if (alias) {
    // If the alias is a symbol, return it; otherwise, look it up in unicodeSymbols
    return unicodeSymbols[alias] || alias;
  }
  const symbol = unicodeSymbols[name];
  if (!symbol) {
    return undefined;
  }
  return symbol;
}

interface UnicodeDataEntry {
  codePoint: string;
  char: string;
  category: string;
  name: string;
}

let _unicodeDataCache: Record<string, UnicodeDataEntry> | null = null;

/**
 * Asynchronously retrieves the Unicode symbol by name using the UnicodeData.txt database.
 * Caches the Unicode data after the first fetch for efficient repeated lookups.
 *
 * @param name - The Unicode character name (e.g., 'GREEK CAPITAL LETTER OMEGA')
 * @returns The Unicode character as a string, or undefined if not found.
 */
export async function getUnicodeSymbolByNameAsync(name: string): Promise<string | undefined> {
  let result: string | undefined;
  if (!_unicodeDataCache) {
    const data = await fetchUnicodeData();
    if (data) {
      _unicodeDataCache = data;
    } else {
      result = undefined;
    }
  }
  const entry = _unicodeDataCache ? _unicodeDataCache[name] : undefined;
  result = entry ? entry.char : undefined;
  if (!result) return getUnicodeSymbolByName(name);
  return result;
}
