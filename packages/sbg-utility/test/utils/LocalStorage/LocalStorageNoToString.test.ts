import { describe, expect, test } from '@jest/globals';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('use key without toString', () => {
    const localStorage = new LocalStorage('./tmp/scratch11');

    expect(() => localStorage.setItem(null, 'foo')).not.toThrow();
    expect(() => localStorage.setItem(undefined, 'bar')).not.toThrow();

    expect(localStorage.getItem('null')).toBe('foo');
    expect(localStorage.getItem('undefined')).toBe('bar');

    localStorage._deleteLocation();
  });

  test('set value without toString', () => {
    const localStorage = new LocalStorage('./tmp/scratch12');

    expect(() => localStorage.setItem('foo', null)).not.toThrow();
    expect(() => localStorage.setItem('bar', undefined)).not.toThrow();

    expect(localStorage.getItem('foo')).toBe('null');
    expect(localStorage.getItem('bar')).toBe('undefined');

    localStorage._deleteLocation();
  });
});
