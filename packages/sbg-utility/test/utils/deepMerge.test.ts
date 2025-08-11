import deepMerge from '../../src/utils/deepMerge';

describe('deepMerge', () => {
  it('merges plain objects deeply', () => {
    const a = { foo: 1, bar: { baz: 2 } };
    const b = { bar: { qux: 3 }, quux: 4 };
    const result = deepMerge(a, b);
    expect(result).toEqual({ foo: 1, bar: { baz: 2, qux: 3 }, quux: 4 });
  });

  it('merges arrays by index and unions nested arrays', () => {
    const a = [1, [2, 3], 4];
    const b = [5, [3, 4], 6];
    const result = deepMerge(a, b);
    expect(result).toEqual([5, [2, 3, 4], 6]);
  });

  it('merges special types: Date, Map, Set, RegExp', () => {
    const date1 = new Date('2020-01-01');
    const date2 = new Date('2021-01-01');
    const map1 = new Map([[1, { a: 1 }]]);
    const map2 = new Map([
      [1, { b: 2 }],
      [2, { c: 3 }]
    ]);
    const set1 = new Set([1, 2]);
    const set2 = new Set([2, 3]);
    const reg1 = /foo/g;
    const reg2 = /bar/i;
    const a = { date: date1, map: map1, set: set1, reg: reg1 };
    const b = { date: date2, map: map2, set: set2, reg: reg2 };
    const result = deepMerge(a, b);
    expect(result.date.getTime()).toBe(date2.getTime());
    expect(result.map.get(1)).toEqual({ a: 1, b: 2 });
    expect(result.map.get(2)).toEqual({ c: 3 });
    expect(Array.from(result.set)).toEqual([1, 2, 3]);
    expect(result.reg.source).toBe('bar');
    expect(result.reg.flags).toBe('i');
  });

  it('handles circular references', () => {
    const a: any = { foo: 1 };
    a.self = a;
    const b: any = { bar: 2 };
    b.self = b;
    const result = deepMerge(a, b);
    expect(result.foo).toBe(1);
    expect(result.bar).toBe(2);
    expect(result.self).toBe(result);
  });

  it('merges symbol keys', () => {
    const sym = Symbol('s');
    const a = { [sym]: { a: 1 } };
    const b = { [sym]: { b: 2 } };
    const result = deepMerge(a, b);
    expect(result[sym]).toEqual({ a: 1, b: 2 });
  });

  it('prefers source function when merging functions', () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const a = { fn: fn1 };
    const b = { fn: fn2 };
    const result = deepMerge(a, b);
    expect(result.fn).toBe(fn2);
  });

  it('returns source if types differ', () => {
    expect(deepMerge({ a: 1 }, 2)).toBe(2);
    expect(deepMerge(2, { a: 1 })).toEqual({ a: 1 });
  });

  it('should act as lodash.merge', () => {
    const obj1: any = { a: [{ b: 2 }, { d: 4 }] };
    const obj2: any = { a: [{ c: 3 }, { e: 5 }] };

    const expected = {
      a: [
        { b: 2, c: 3 },
        { d: 4, e: 5 }
      ]
    };
    const result: any = deepMerge(obj1, obj2);
    expect(result).toEqual(expected);
  });

  it('should do a deep merge', () => {
    const obj1: any = { a: { b: 1, c: 1, d: { e: 1, f: 1 } } };
    const obj2: any = { a: { b: 2, d: { f: 'f' } } };

    const expected = { a: { b: 2, c: 1, d: { e: 1, f: 'f' } } };
    const result: any = deepMerge(obj1, obj2);
    expect(result).toEqual(expected);
  });

  it('should not merge strings', () => {
    const obj1: any = { a: 'fooo' };
    const obj2: any = { a: { b: 2, d: { f: 'f' } } };
    const obj3: any = { a: 'bar' };

    const result: any = deepMerge(deepMerge(obj1, obj2), obj3);
    expect(result.a).toEqual('bar');
  });

  it('should merge simple array', () => {
    const obj1 = { a: [1, [2, 3], 4] };
    const obj2 = { a: [1, [3, 4], [5, 6], 6] };

    const result = deepMerge(obj1, obj2);
    const expected = { a: [1, [2, 3, 4], [5, 6], 6] };

    expect(result).toEqual(expected);
  });

  it('should not merge an objects into an array', () => {
    const obj1: any = { a: { b: 1 } };
    const obj2: any = { a: ['foo', 'bar'] };

    const result: any = deepMerge(obj1, obj2);
    expect(result).toEqual({ a: ['foo', 'bar'] });
  });

  it('should not affect target & source', () => {
    const obj1 = { a: 0, b: 1, c: { d: 1 }, e: 4 };
    const obj2 = { b: 3, c: { d: 2 } };

    const result = deepMerge(obj1, obj2);
    const expected = { a: 0, b: 3, c: { d: 2 }, e: 4 };

    expect(result).toEqual(expected);
    expect(result).not.toBe(obj1);
    expect(obj1).toEqual({ a: 0, b: 1, c: { d: 1 }, e: 4 });
    expect(result).not.toBe(obj2);
    expect(obj2).toEqual({ b: 3, c: { d: 2 } });
  });

  it('should deep clone arrays during merge', () => {
    const obj1: any = { a: [1, 2, [3, 4]] };
    const obj2: any = { b: [5, 6] };

    const result: any = deepMerge(obj1, obj2);

    expect(result.a).toEqual([1, 2, [3, 4]]);
    expect(result.a[2]).toEqual([3, 4]);
    expect(result.b).toEqual(obj2.b);
  });

  it('should handle Date type', () => {
    const date1 = new Date('2020-01-01T00:00:00Z');
    const date2 = new Date('2022-01-01T00:00:00Z');
    const obj1 = { date: date1 };
    const obj2 = { date: date2 };
    const result = deepMerge(obj1, obj2);
    expect(result.date.getTime()).toEqual(date2.getTime());
    expect(result.date).not.toBe(date1);
    expect(result.date).not.toBe(date2); // Should be a clone
  });

  it('should handle RegExp type', () => {
    const reg1 = /foo/g;
    const reg2 = /bar/i;
    const obj1 = { regexp: reg1 };
    const obj2 = { regexp: reg2 };
    const result = deepMerge(obj1, obj2);
    expect(result.regexp.source).toEqual(reg2.source);
    expect(result.regexp.flags).toEqual(reg2.flags);
    expect(result.regexp).not.toBe(reg1);
    expect(result.regexp).not.toBe(reg2); // Should be a clone
  });

  it('should handle Map type', () => {
    const map1 = new Map<number, any>([
      [1, { a: 1 }],
      [2, { b: 2 }]
    ]);
    const map2 = new Map<number, any>([
      [2, { b: 3 }],
      [3, { c: 4 }]
    ]);
    const obj1 = { map: map1 };
    const obj2 = { map: map2 };
    const result = deepMerge(obj1, obj2);
    expect(Array.from(result.map.keys())).toEqual([1, 2, 3]);
    expect(result.map.get(1)).toEqual({ a: 1 });
    expect(result.map.get(2)).toEqual({ b: 3 });
    expect(result.map.get(3)).toEqual({ c: 4 });
    expect(result.map).not.toBe(map1);
    expect(result.map).not.toBe(map2);
  });

  it('should handle Set type', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 4, 5]);
    const obj1 = { set: set1 };
    const obj2 = { set: set2 };
    const result = deepMerge(obj1, obj2);
    expect(Array.from(result.set).sort()).toEqual([1, 2, 3, 4, 5]);
    expect(result.set).not.toBe(set1);
    expect(result.set).not.toBe(set2);
  });

  it('should handle Function type', () => {
    const fn1 = function () {
      return 1;
    };
    const fn2 = function () {
      return 2;
    };
    const obj1 = { fn: fn1 };
    const obj2 = { fn: fn2 };
    const result = deepMerge(obj1, obj2);
    expect(result.fn).toBe(fn2);
  });

  it('should handle thousands of circular references', () => {
    // Create 1000 objects with circular references and multiple types
    const arr1: any[] = [];
    const arr2: any[] = [];
    for (let i = 0; i < 1000; i++) {
      arr1[i] = {
        idx: i,
        date: new Date(2020, 0, i + 1),
        regexp: new RegExp(`foo${i}`, i % 2 ? 'g' : 'i'),
        map: new Map([[i, { val: i }]]),
        set: new Set([i, i + 1]),
        fn: function () {
          return i;
        }
      };
      arr2[i] = {
        idx: i,
        date: new Date(2021, 0, i + 1),
        regexp: new RegExp(`bar${i}`, i % 2 ? 'i' : 'g'),
        map: new Map([[i, { val: i * 2 }]]),
        set: new Set([i, i + 2]),
        fn: function () {
          return i * 2;
        }
      };
    }
    // Add circular references
    for (let i = 0; i < 1000; i++) {
      arr1[i].self = arr1[i];
      arr2[i].self = arr2[i];
      if (i > 0) {
        arr1[i].prev = arr1[i - 1];
        arr2[i].prev = arr2[i - 1];
      }
    }
    const obj1 = { arr: arr1 };
    const obj2 = { arr: arr2 };
    const result = deepMerge(obj1, obj2);
    // Check merged array length
    expect(result.arr.length).toEqual(1000);
    // Check circular references and types are preserved and not the same as original
    for (let i = 0; i < 1000; i++) {
      expect(result.arr[i]).toHaveProperty('idx', i);
      expect(result.arr[i]).toHaveProperty('self');
      expect(result.arr[i].self).toBe(result.arr[i]);
      if (i > 0) {
        expect(result.arr[i]).toHaveProperty('prev');
        expect(result.arr[i].prev).toBe(result.arr[i - 1]);
      }
      // Should not be the same object as arr1 or arr2
      expect(result.arr[i]).not.toBe(arr1[i]);
      expect(result.arr[i]).not.toBe(arr2[i]);
      // Check Date
      expect(result.arr[i].date.getTime()).toEqual(arr2[i].date.getTime());
      expect(result.arr[i].date).not.toBe(arr1[i].date);
      expect(result.arr[i].date).not.toBe(arr2[i].date);
      // Check RegExp
      expect(result.arr[i].regexp.source).toEqual(arr2[i].regexp.source);
      expect(result.arr[i].regexp.flags).toEqual(arr2[i].regexp.flags);
      expect(result.arr[i].regexp).not.toBe(arr1[i].regexp);
      expect(result.arr[i].regexp).not.toBe(arr2[i].regexp);
      // Check Map
      expect(Array.from(result.arr[i].map.keys())).toEqual(Array.from(arr2[i].map.keys()));
      expect(result.arr[i].map.get(i)).toEqual({ val: i * 2 });
      expect(result.arr[i].map).not.toBe(arr1[i].map);
      expect(result.arr[i].map).not.toBe(arr2[i].map);
      // Check Set
      expect(Array.from(result.arr[i].set).sort()).toEqual(
        Array.from(new Set([...arr1[i].set, ...arr2[i].set])).sort()
      );
      expect(result.arr[i].set).not.toBe(arr1[i].set);
      expect(result.arr[i].set).not.toBe(arr2[i].set);
      // Check Function
      expect(result.arr[i].fn).toBe(arr2[i].fn);
    }
  });

  it('should handle null and undefined as source and target', () => {
    expect(deepMerge(null, { a: 1 })).toEqual({ a: 1 });
    expect(deepMerge({ a: 1 }, null)).toEqual(null);
    expect(deepMerge(undefined, { a: 2 })).toEqual({ a: 2 });
    expect(deepMerge({ a: 2 }, undefined)).toEqual(undefined);
    expect(deepMerge(null, null)).toEqual(null);
    expect(deepMerge(undefined, undefined)).toEqual(undefined);
  });

  it('should handle empty objects and arrays', () => {
    expect(deepMerge({}, {})).toEqual({});
    expect(deepMerge([], [])).toEqual([]);
    expect(deepMerge({ a: [] }, { a: [] })).toEqual({ a: [] });
    expect(deepMerge({ a: {} }, { a: {} })).toEqual({ a: {} });
  });

  it('should handle symbol properties', () => {
    const sym = Symbol('s');
    const obj1: any = { [sym]: 123 };
    const obj2: any = { [sym]: 456 };
    const result = deepMerge(obj1, obj2);
    expect(result[sym]).toEqual(456);
  });

  it('should handle sparse arrays', () => {
    const arr1 = [] as any[];
    arr1[2] = 3;
    const arr2 = [] as any[];
    arr2[1] = 2;
    const result = deepMerge(arr1, arr2);
    expect(result.length).toEqual(3);
    expect(result[1]).toEqual(2);
    expect(result[2]).toEqual(3);
  });

  it('should not merge inherited properties', () => {
    function Parent(this: Record<string, any>) {
      this.inherited = 1;
    }
    Parent.prototype.protoProp = 2;
    const obj1 = new (Parent as any)();
    const obj2 = { own: 3 };
    const result = deepMerge(obj1, obj2);
    expect(result).toHaveProperty('inherited', 1);
    expect(result).toHaveProperty('own', 3);
    expect(result).not.toHaveProperty('protoProp');
  });

  it('should handle merging function with non-function', () => {
    const obj1 = {
      fn: function () {
        return 1;
      }
    };
    const obj2 = { fn: 42 };
    const result = deepMerge(obj1, obj2 as any);
    expect(result.fn).toEqual(42);
    const result2 = deepMerge(obj2, obj1 as any);
    expect(typeof result2.fn).toBe('function');
  });

  it('should handle deeply nested mixed types', () => {
    const obj1 = { a: [{ b: { c: [1, 2, { d: 'x' }] } }] };
    const obj2 = { a: [{ b: { c: [1, 3, { d: 'y', e: 'z' }] } }] };
    const result = deepMerge(obj1, obj2);
    expect(result.a[0].b.c[0]).toEqual(1);
    expect(result.a[0].b.c[1]).toEqual(3);
    expect(result.a[0].b.c[2]).toEqual({ d: 'y', e: 'z' });
  });
});
