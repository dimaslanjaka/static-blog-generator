import { describe, expect, test } from '@jest/globals';
import path from 'path';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

function repeat(str: string, count: number) {
  const a: string[] = [];

  while (count--) {
    a.push(str);
  }

  return a.join('');
}

describe('LocalStorage', () => {
  test('localStorage API', () => {
    const localStorage = new LocalStorage('./tmp/scratch');

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
    expect(localStorage.getItem('2')).toEqual(o.toString());

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
    expect(localStorage.getItem('2')).toEqual(a.toString());

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

  test('quota', () => {
    const n10 = '01234567890';
    const n100 = repeat('0123456789', 10);
    const n1000 = repeat(n100, 10);
    const n10000 = repeat(n1000, 10);

    const ls = new LocalStorage('./tmp/scratch2', 3000);

    ls.setItem(1, n1000);
    ls.setItem(2, n1000);
    ls.setItem(3, n1000);
    expect(() => {
      ls.setItem(4, n10000);
    }).toThrow(Error);

    expect(ls._getBytesInUse()).toBe(3000);

    expect(() => {
      ls.setItem(6, n10);
    }).toThrow(Error);

    // Should not throw because it replaces one of equal size
    ls.setItem(2, n1000);

    ls.removeItem(3);
    ls.setItem(7, n100);

    expect(() => {
      ls.setItem(8, n1000);
    }).toThrow(Error);

    ls._deleteLocation();
  });

  // test('no new keyword', () => {
  //   const local = LocalStorage('./tmp/scratch3');
  //
  //   local.setItem('Hello', ' world!');
  //
  //   expect(local.getItem('Hello')).toBe(' world!');
  //
  //   local._deleteLocation();
  // });

  test('null', () => {
    const local = new LocalStorage('./tmp/scratch4');

    expect(local.getItem('junk')).toBeNull();

    local._deleteLocation();
  });

  test('remove keys', () => {
    const localStorage = new LocalStorage('./tmp/scratch6');

    localStorage.setItem('a', 'hello');
    localStorage.setItem('b', 'hello');
    localStorage.setItem('c', 'hello');
    localStorage.setItem('d', 'hello');

    expect((localStorage as any)._keys).toEqual(['a', 'b', 'c', 'd']);
    expect(Object.keys(localStorage)).toEqual(['a', 'b', 'c', 'd']);

    localStorage.removeItem('c');
    expect((localStorage as any)._keys).toEqual(['a', 'b', 'd']);

    localStorage.removeItem('a');
    expect((localStorage as any)._keys).toEqual(['b', 'd']);

    localStorage.removeItem('b');
    expect((localStorage as any)._keys).toEqual(['d']);

    localStorage.removeItem('d');
    expect((localStorage as any)._keys).toEqual([]);

    expect(Object.keys(localStorage)).toEqual([]);

    localStorage._deleteLocation();
  });

  test('events', () => {
    const localStorage = new LocalStorage('./tmp/scratch5');

    const expectedUrl = `pid:${process.pid}`;

    let key = null;
    let oldVal = null;
    let newVal = null;
    let url = null;

    const handleEvent = (evnt) => {
      key = evnt.key;
      oldVal = evnt.oldValue;
      newVal = evnt.newValue;
      url = evnt.url;
    };

    localStorage.on('storage', handleEvent);

    localStorage.setItem('a', 'something');

    expect(localStorage.getItem('a')).toBe('something');
    expect(key).toBe('a');
    expect(oldVal).toBeNull();
    expect(newVal).toBe('something');
    expect(url).toBe(expectedUrl);

    key = null;
    oldVal = null;
    newVal = null;
    url = null;

    localStorage.setItem('a', 'somethingnew');

    expect(localStorage.getItem('a')).toBe('somethingnew');
    expect(key).toBe('a');
    expect(oldVal).toBe('something');
    expect(newVal).toBe('somethingnew');
    expect(url).toBe(expectedUrl);

    key = null;
    oldVal = null;
    newVal = null;
    url = null;

    localStorage.removeItem('a');

    expect(localStorage.getItem('a')).toBeNull();
    expect(key).toBe('a');
    expect(oldVal).toBe('somethingnew');
    expect(newVal).toBeNull();
    expect(url).toBe(expectedUrl);

    key = null;
    oldVal = null;
    newVal = null;
    url = null;

    localStorage.clear();

    expect(localStorage.getItem('a')).toBeNull();
    expect(key).toBeNull();
    expect(oldVal).toBeNull();
    expect(newVal).toBeNull();
    expect(url).toBe(expectedUrl);

    localStorage._deleteLocation();
  });

  test('get stat', () => {
    const localStorage = new LocalStorage('./tmp/scratch7');

    const o = {
      a: 1,
      b: 'some string',
      c: {
        x: 1,
        y: 2
      }
    };

    localStorage.setItem('stat', o);

    expect(localStorage.getItem('stat')).toEqual(o.toString());

    expect((localStorage as any)._getStat('stat')).toBeTruthy();
    expect((localStorage as any)._getStat('not there')).toBeNull();

    localStorage._deleteLocation();
  });

  test('empty string', () => {
    const localStorage = new LocalStorage('./tmp/scratch8');

    localStorage.setItem('', 'something');

    expect(localStorage.getItem('')).toBe('something');

    expect(localStorage.key(0)).toBe('');

    localStorage._deleteLocation();
  });
});
