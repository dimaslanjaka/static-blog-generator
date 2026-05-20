import { describe, expect, test } from '@jest/globals';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('array and dot notation', () => {
    // TODO:
    // These tests are inadequate in that it will pass even when there is no
    // Proxy object. Need to check for file existence.

    const localStorage = new LocalStorage('./tmp/scratch9');

    localStorage['a'] = 'something';
    expect(localStorage['a']).toBe('something');

    localStorage[''] = 'something else';
    expect(localStorage['']).toBe('something else');

    (localStorage as any).b = 1;
    expect(localStorage['b']).toBe('1');

    expect(Object.keys(localStorage)).toEqual(['a', '', 'b']);

    localStorage._deleteLocation();
  });
});
