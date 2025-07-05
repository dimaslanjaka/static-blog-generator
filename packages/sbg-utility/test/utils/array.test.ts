import {
  array_flatten as array_flatten_src,
  array_random as array_random_src,
  array_remove_empty as array_remove_empty_src,
  array_shuffle as array_shuffle_src,
  array_shuffle_swap as array_shuffle_swap_src,
  array_unique as array_unique_src,
  arrayOfObjUniq as arrayOfObjUniq_src
} from '../../src/utils/array';

import {
  array_flatten as array_flatten_dist,
  array_random as array_random_dist,
  array_remove_empty as array_remove_empty_dist,
  array_shuffle as array_shuffle_dist,
  array_shuffle_swap as array_shuffle_swap_dist,
  array_unique as array_unique_dist,
  arrayOfObjUniq as arrayOfObjUniq_dist
} from '../../dist/utils/array.mjs';

describe.each([
  [
    'src',
    {
      array_flatten: array_flatten_src,
      array_random: array_random_src,
      array_remove_empty: array_remove_empty_src,
      array_shuffle: array_shuffle_src,
      array_shuffle_swap: array_shuffle_swap_src,
      array_unique: array_unique_src,
      arrayOfObjUniq: arrayOfObjUniq_src
    }
  ],
  [
    'dist',
    {
      array_flatten: array_flatten_dist,
      array_random: array_random_dist,
      array_remove_empty: array_remove_empty_dist,
      array_shuffle: array_shuffle_dist,
      array_shuffle_swap: array_shuffle_swap_dist,
      array_unique: array_unique_dist,
      arrayOfObjUniq: arrayOfObjUniq_dist
    }
  ]
])(
  '%s build',
  (
    _label,
    { array_flatten, array_random, array_remove_empty, array_shuffle, array_shuffle_swap, array_unique, arrayOfObjUniq }
  ) => {
    describe('array_random', () => {
      it('returns a random item from the array', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = array_random(arr);
        expect(arr.includes(result)).toBe(true);
      });
    });

    describe('array_unique', () => {
      it('removes duplicate primitives', () => {
        const arr = [1, 2, 2, 3, 1, 4];
        expect(array_unique(arr)).toEqual([1, 2, 3, 4]);
      });
      it('removes duplicate objects by field', () => {
        const arr = [
          { id: 1, v: 'a' },
          { id: 2, v: 'b' },
          { id: 1, v: 'c' }
        ];
        expect(array_unique(arr, 'id')).toEqual([
          { id: 1, v: 'a' },
          { id: 2, v: 'b' }
        ]);
      });
      it('removes empty strings and arrays', () => {
        const arr = [1, '', 2, [], 3, '  ', 4];
        expect(array_unique(arr)).toEqual([1, 2, 3, 4]);
      });
    });

    describe('array_remove_empty', () => {
      it('removes empty strings, arrays, and objects', () => {
        const arr = [1, '', 2, [], 3, {}, 4, '  ', { a: 1 }];
        expect(array_remove_empty(arr)).toEqual([1, 2, 3, 4, { a: 1 }]);
      });
    });

    describe('arrayOfObjUniq', () => {
      it('removes duplicate objects by key', () => {
        const arr = [
          { p: 'x', n: 'x' },
          { p: '23', n: 'x' },
          { p: 'x', n: '5g' }
        ];
        expect(arrayOfObjUniq(arr, 'p')).toEqual([
          { p: 'x', n: 'x' },
          { p: '23', n: 'x' }
        ]);
      });
      it('throws if not array', () => {
        expect(() => arrayOfObjUniq(null as any, 'p')).toThrow();
      });
    });

    describe('array_shuffle', () => {
      it('shuffles the array (may rarely fail)', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = array_shuffle([...arr]);
        expect(shuffled.sort()).toEqual(arr);
      });
    });

    describe('array_shuffle_swap', () => {
      it('shuffles the array in place (may rarely fail)', () => {
        const arr = [1, 2, 3, 4, 5];
        array_shuffle_swap(arr);
        expect(arr.sort()).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('array_flatten', () => {
      it('flattens nested arrays', () => {
        const arr = [1, [2, [3, 4]], 5];
        expect(array_flatten(arr)).toEqual([1, 2, 3, 4, 5]);
      });
      it('flattens to specified depth', () => {
        const arr = [1, [2, [3, 4]], 5];
        expect(array_flatten(arr, 1)).toEqual([1, 2, [3, 4], 5]);
      });
    });
  }
);
