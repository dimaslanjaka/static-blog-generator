import { cleanString } from '../../src/utils/string';

describe('cleanString', () => {
  it('should collapse whitespace by default', () => {
    expect(cleanString('a   b\n\t c')).toBe('a b c');
  });

  it('should convert to lowercase if toLowerCase is true', () => {
    expect(cleanString('HeLLo WoRLD', { toLowerCase: true })).toBe('hello world');
  });

  it('should remove zero-width characters if removeZeroWidth is true', () => {
    expect(cleanString('a\u200Bb\u200Cc', { removeZeroWidth: true })).toBe('abc');
  });

  it('should keep only letters, numbers, and spaces if keepAlphaNumSpace is true', () => {
    expect(cleanString('a!@# b123\n\t$', { keepAlphaNumSpace: true })).toBe('a b123');
  });

  it('should remove zero-width characters if keepZeroWidth is false', () => {
    expect(cleanString('a\u200Bb\u200Dc', { keepZeroWidth: false })).toBe('abc');
  });

  it('should keep zero-width characters if keepZeroWidth is true', () => {
    expect(cleanString('a\u200Bb\u200Dc', { keepZeroWidth: true })).toBe('a\u200Bb\u200Dc');
  });

  it('should trim the result', () => {
    expect(cleanString('   hello   ')).toBe('hello');
  });

  it('should combine options correctly', () => {
    expect(
      cleanString('  A!@#\u200B B\u200C123\n\t$', {
        toLowerCase: true,
        removeZeroWidth: true,
        keepAlphaNumSpace: true,
        collapseWhitespace: true
      })
    ).toBe('a b123');
  });
});
