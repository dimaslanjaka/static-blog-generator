import { describe, expect, test } from '@jest/globals';
import defaults, * as wilcards from '../src';

// jest --runInBand imports.test

describe('check method', () => {
  const props = ['getSourcePosts'];

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    test(`wilcards.${prop} is function`, function () {
      expect(wilcards[prop]).toBeDefined();
      expect(typeof wilcards[prop]).toBe('function');
    }, 10000);
    test(`defaults.${prop} is function`, function () {
      expect(defaults[prop]).toBeDefined();
      expect(typeof defaults[prop]).toBe('function');
    }, 10000);
  }
});
