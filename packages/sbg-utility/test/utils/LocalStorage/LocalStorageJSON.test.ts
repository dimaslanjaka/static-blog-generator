import { describe, expect, test } from '@jest/globals';
import path from 'path';
import { JSONStorage } from '../../../src/utils/LocalStorage.js';

describe('JSONStorage', () => {
  test('JSONStorage', () => {
    const localStorage = new JSONStorage('./tmp/scratch');

    expect((localStorage as any)._location).toBe(path.resolve('./tmp/scratch'));

    localStorage.setItem('/', 'something');
    expect(localStorage.getItem('/')).toBe('something');

    const o = {
      a: 1,
      b: 'some string',
      c: {
        x: 1,
        y: 2
      }
    };

    localStorage.setItem('2', o);
    expect(localStorage.getItem('2')).toEqual(o);

    const a = [
      1,
      'some string',
      {
        a: 1,
        b: 'some string',
        c: {
          x: 1,
          y: 2
        }
      }
    ];

    localStorage.setItem('2', a);
    expect(localStorage.getItem('2')).toEqual(a);

    expect((localStorage as any)._keys).toEqual(['/', '2']);
    expect(localStorage.length).toBe(2);

    localStorage.removeItem('2');
    expect(localStorage.getItem('2')).toBeNull();

    expect((localStorage as any)._keys).toEqual(['/']);
    expect(localStorage.length).toBe(1);

    expect(localStorage.key(0)).toBe('/');
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    localStorage._deleteLocation();
  });

  // test('no new keyword', () => {
  //   const local = JSONStorage('./tmp/scratch3');
  //
  //   local.setItem('Hello', ' world!');
  //
  //   expect(local.getItem('Hello')).toBe(' world!');
  //
  //   local._deleteLocation();
  // });

  test('null', () => {
    const local = new JSONStorage('./tmp/scratch4');

    expect(local.getItem('junk')).toBeNull();

    local._deleteLocation();
  });
});
