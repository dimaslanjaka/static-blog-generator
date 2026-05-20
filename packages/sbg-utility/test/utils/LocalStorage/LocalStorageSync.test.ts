import { describe, expect, test } from '@jest/globals';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('use key with asterix', () => {
    const storage1 = new LocalStorage('./tmp/scratch12');
    const storage2 = new LocalStorage('./tmp/scratch12');

    expect(() => {
      storage1.setItem('***test***', 'foo');
    }).not.toThrow();

    expect(() => {
      storage2._sync();
    }).not.toThrow();

    expect(storage2.getItem('***test***')).toBe('foo');

    storage1._deleteLocation();
  });
});
