import { expect, describe, it, jest } from '@jest/globals';
import sanitizeFilename from '../../src/utils/filemanager/sanitizeFilename';

describe('sanitizeFilename', () => {
  it('replaces invalid characters and preserves extension', () => {
    expect(sanitizeFilename('my:file?.txt')).toBe('my-file-.txt');
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

  it('invokes callback and can modify result before return', () => {
    const cb = jest.fn((res: string) => res.toUpperCase());
    expect(sanitizeFilename('a:b.txt', { callback: cb })).toBe('A-B.TXT');
    expect(cb).toHaveBeenCalledWith('a-b.txt');
  });

  it('should keep spaces and replace invalid characters', () => {
    expect(sanitizeFilename('my file:name.txt')).toBe('my file-name.txt');
  });

  it('should handle non-string input gracefully', () => {
    expect(sanitizeFilename(null as unknown as string)).toBe('unnamed');
    expect(sanitizeFilename(undefined as unknown as string)).toBe('unnamed');
    expect(sanitizeFilename(123 as unknown as string)).toBe('123');
    expect(sanitizeFilename([1, 2, 3] as unknown as string)).toBe('1,2,3');
    expect(sanitizeFilename({ a: 1 } as unknown as string)).toBe('[object Object]');
    class TestClass {}
    expect(sanitizeFilename(new TestClass())).toBe('TestClass');
  });
});

export {};
