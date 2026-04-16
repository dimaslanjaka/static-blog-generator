import { describe, expect } from '@jest/globals';
import isEmpty, { isNotEmpty } from '../../src/utils/empty';

describe('isEmpty', () => {
  describe('null and undefined', () => {
    it('returns true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe('strings', () => {
    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('returns false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
    });

    it('returns false for string with whitespace', () => {
      expect(isEmpty('   ')).toBe(false);
    });
  });

  describe('arrays', () => {
    it('returns true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('returns false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('returns false for array with single element', () => {
      expect(isEmpty([0])).toBe(false);
    });

    it('returns false for array with null element', () => {
      expect(isEmpty([null])).toBe(false);
    });
  });

  describe('sets', () => {
    it('returns true for empty set', () => {
      expect(isEmpty(new Set())).toBe(true);
    });

    it('returns false for non-empty set', () => {
      expect(isEmpty(new Set([1]))).toBe(false);
    });
  });

  describe('maps', () => {
    it('returns true for empty map', () => {
      expect(isEmpty(new Map())).toBe(true);
    });

    it('returns false for non-empty map', () => {
      expect(isEmpty(new Map([['a', 1]]))).toBe(false);
    });
  });

  describe('objects', () => {
    it('returns true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('returns false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('returns false for object with null value', () => {
      expect(isEmpty({ a: null })).toBe(false);
    });

    it('returns false for object with undefined value', () => {
      expect(isEmpty({ a: undefined })).toBe(false);
    });
  });

  describe('primitives', () => {
    it('returns false for number 0', () => {
      expect(isEmpty(0)).toBe(false);
    });

    it('returns false for number 1', () => {
      expect(isEmpty(1)).toBe(false);
    });

    it('returns false for boolean false', () => {
      expect(isEmpty(false)).toBe(false);
    });

    it('returns false for boolean true', () => {
      expect(isEmpty(true)).toBe(false);
    });
  });

  describe('allowWhitespace option', () => {
    it('returns false for whitespace string when allowWhitespace is false', () => {
      expect(isEmpty('   ', { allowWhitespace: false })).toBe(false);
    });

    it('returns true for whitespace string when allowWhitespace is true', () => {
      expect(isEmpty('   ', { allowWhitespace: true })).toBe(true);
    });

    it('returns true for empty string when allowWhitespace is true', () => {
      expect(isEmpty('', { allowWhitespace: true })).toBe(true);
    });

    it('returns false for non-empty string when allowWhitespace is true', () => {
      expect(isEmpty('hello', { allowWhitespace: true })).toBe(false);
    });

    it('returns true for whitespace with tabs and newlines when allowWhitespace is true', () => {
      expect(isEmpty('  \t\n  ', { allowWhitespace: true })).toBe(true);
    });
  });
});

describe('isNotEmpty', () => {
  describe('null and undefined', () => {
    it('returns false for null', () => {
      expect(isNotEmpty(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('strings', () => {
    it('returns false for empty string', () => {
      expect(isNotEmpty('')).toBe(false);
    });

    it('returns true for non-empty string', () => {
      expect(isNotEmpty('hello')).toBe(true);
    });

    it('returns true for string with whitespace', () => {
      expect(isNotEmpty('   ')).toBe(true);
    });
  });

  describe('arrays', () => {
    it('returns false for empty array', () => {
      expect(isNotEmpty([])).toBe(false);
    });

    it('returns true for non-empty array', () => {
      expect(isNotEmpty([1, 2, 3])).toBe(true);
    });
  });

  describe('sets', () => {
    it('returns false for empty set', () => {
      expect(isNotEmpty(new Set())).toBe(false);
    });

    it('returns true for non-empty set', () => {
      expect(isNotEmpty(new Set([1]))).toBe(true);
    });
  });

  describe('maps', () => {
    it('returns false for empty map', () => {
      expect(isNotEmpty(new Map())).toBe(false);
    });

    it('returns true for non-empty map', () => {
      expect(isNotEmpty(new Map([['a', 1]]))).toBe(true);
    });
  });

  describe('objects', () => {
    it('returns false for empty object', () => {
      expect(isNotEmpty({})).toBe(false);
    });

    it('returns true for non-empty object', () => {
      expect(isNotEmpty({ a: 1 })).toBe(true);
    });
  });

  describe('primitives', () => {
    it('returns true for number 0', () => {
      expect(isNotEmpty(0)).toBe(true);
    });

    it('returns true for boolean false', () => {
      expect(isNotEmpty(false)).toBe(true);
    });
  });

  describe('allowWhitespace option', () => {
    it('returns true for whitespace string when allowWhitespace is false', () => {
      expect(isNotEmpty('   ', { allowWhitespace: false })).toBe(true);
    });

    it('returns false for whitespace string when allowWhitespace is true', () => {
      expect(isNotEmpty('   ', { allowWhitespace: true })).toBe(false);
    });

    it('returns false for empty string when allowWhitespace is true', () => {
      expect(isNotEmpty('', { allowWhitespace: true })).toBe(false);
    });

    it('returns true for non-empty string when allowWhitespace is true', () => {
      expect(isNotEmpty('hello', { allowWhitespace: true })).toBe(true);
    });
  });
});
