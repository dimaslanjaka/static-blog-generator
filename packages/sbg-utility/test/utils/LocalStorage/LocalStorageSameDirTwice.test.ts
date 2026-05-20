import { describe, expect, test } from '@jest/globals';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('same directory twice', () => {
    const localStorage1 = new LocalStorage('./tmp/scratch10');
    const localStorage2 = new LocalStorage('./tmp/scratch10');

    localStorage1.setItem('key1', 'value1');

    expect(localStorage1.getItem('key1')).toBe(localStorage2.getItem('key1'));

    localStorage1._deleteLocation();
  });
});
