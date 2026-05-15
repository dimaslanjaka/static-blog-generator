import { describe, expect, it } from '@jest/globals';
import {
  getUnicodeSymbol,
  getUnicodeSymbolByName,
  getUnicodeSymbolByNameAsync
} from '../../src/symbols/unicode-symbols.js';

describe('getUnicodeSymbol', () => {
  it('should return the correct symbol for a real Unicode name', async () => {
    expect(await getUnicodeSymbol('GREEK CAPITAL LETTER OMEGA')).toBe('Ω');
  });

  it('should return the correct symbol for a local alias', async () => {
    expect(await getUnicodeSymbol('check')).toBe('✔');
  });

  it('should return undefined for an unknown name', async () => {
    expect(await getUnicodeSymbol('not-a-real-symbol')).toBeUndefined();
  });

  it('should return the correct symbol with search keyword', async () => {
    expect(await getUnicodeSymbol('OMEGA')).toBe('Ω');
    expect(await getUnicodeSymbol('omega')).toBe('ω');
  });
});

describe('getUnicodeSymbolByNameAsync', () => {
  it('should return the correct symbol for a real Unicode name', async () => {
    // Example: 'GREEK CAPITAL LETTER OMEGA' should return 'Ω'
    expect(await getUnicodeSymbolByNameAsync('GREEK CAPITAL LETTER OMEGA')).toBe('Ω');
  });

  it('should return the correct symbol for a local alias', async () => {
    // Should fallback to local alias if not found in UnicodeData
    expect(await getUnicodeSymbolByNameAsync('check')).toBe('✔');
  });

  it('should return undefined for an unknown name', async () => {
    expect(await getUnicodeSymbolByNameAsync('not-a-real-symbol')).toBeUndefined();
  });
});

describe('getUnicodeSymbolByName', () => {
  it('should return the correct symbol for a known name', () => {
    // Use 'tick' which is defined in the unicode-symbols package
    expect(getUnicodeSymbolByName('tick')).toBe('✔');
    // Also test the alias 'check'
    expect(getUnicodeSymbolByName('check')).toBe('✔');
  });

  it('should return undefined for an unknown name', () => {
    expect(getUnicodeSymbolByName('not-a-real-symbol')).toBeUndefined();
  });
});
