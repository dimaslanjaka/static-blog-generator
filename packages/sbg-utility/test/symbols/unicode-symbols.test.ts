import { getUnicodeSymbolByName, getUnicodeSymbolByNameAsync } from '../../src/symbols/unicode-symbols.js';

describe('getUnicodeSymbolByNameAsync', () => {
  it('should return the correct symbol for a real Unicode name', async () => {
    // Example: 'GREEK CAPITAL LETTER OMEGA' should return 'Ω'
    const symbol = await getUnicodeSymbolByNameAsync('GREEK CAPITAL LETTER OMEGA');
    expect(symbol).toBe('Ω');
  });

  it('should return the correct symbol for a local alias', async () => {
    // Should fallback to local alias if not found in UnicodeData
    const symbol = await getUnicodeSymbolByNameAsync('check');
    expect(symbol).toBe('✔');
  });

  it('should return undefined for an unknown name', async () => {
    const symbol = await getUnicodeSymbolByNameAsync('not-a-real-symbol');
    expect(symbol).toBeUndefined();
  });
});

describe('getUnicodeSymbol', () => {
  it('should return the correct symbol for a known name', () => {
    // Use 'tick' which is defined in the unicode-symbols package
    const symbol = getUnicodeSymbolByName('tick');
    expect(symbol).toBe('✔');
    // Also test the alias 'check'
    const checkSymbol = getUnicodeSymbolByName('check');
    expect(checkSymbol).toBe('✔');
  });

  it('should return undefined for an unknown name', () => {
    const symbol = getUnicodeSymbolByName('not-a-real-symbol');
    expect(symbol).toBeUndefined();
  });
});
