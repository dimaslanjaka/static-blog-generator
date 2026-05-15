import { expect, describe, it } from '@jest/globals';
import sanitizeFilename from '../../src/utils/filemanager/sanitizeFilename';

describe('sanitizeFilename', () => {
  it('replaces invalid characters and preserves extension', () => {
    expect(sanitizeFilename('my:file?.txt')).toBe('my-file-.txt');
  });

  it('appends replacement for reserved Windows names', () => {
    expect(sanitizeFilename('CON')).toBe('CON-');
  });

  it('removes ASCII control characters from name and preserves extension', () => {
    expect(sanitizeFilename(`a${String.fromCharCode(0)}b.txt`)).toBe('a-b.txt');
  });

  it('collapses repeated replacements', () => {
    expect(sanitizeFilename('a::b')).toBe('a-b');
  });

  it('trims trailing dots and spaces', () => {
    expect(sanitizeFilename('hello. ')).toBe('hello');
  });

  it('enforces maxLength while preserving extension', () => {
    expect(sanitizeFilename('longfilename.txt', { maxLength: 10 })).toBe('longfi.txt');
  });

  it('returns unnamed for empty input', () => {
    expect(sanitizeFilename('')).toBe('unnamed');
  });
});

export {};
