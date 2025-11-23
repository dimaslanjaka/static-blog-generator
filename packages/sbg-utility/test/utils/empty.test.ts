import { describe, expect } from '@jest/globals';
import isEmpty from '../../src/utils/empty';

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
});
