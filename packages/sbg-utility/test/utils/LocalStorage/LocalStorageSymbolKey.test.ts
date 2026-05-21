import { describe, expect, test } from '@jest/globals';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('use key with asterix', () => {
    const localStorage = new LocalStorage('./tmp/scratch11');

    expect(() => {
      localStorage.setItem('***test***', 'foo');
    }).not.toThrow();

    expect(localStorage.getItem('***test***')).toBe('foo');

    localStorage._deleteLocation();
  });
});
