import { describe, expect, test } from '@jest/globals';
import defaults, * as wildcards from '../src';

// jest --runInBand imports.test

describe('check method', () => {
  const props = ['getSourcePosts'];
  const libs_wildcards = wildcards as Record<string, any>;
  const libs_defaults = defaults as Record<string, any>;

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    test(`wilcards.${prop} is function`, function () {
      expect(libs_wildcards[prop]).toBeDefined();
      expect(typeof libs_wildcards[prop]).toBe('function');
    }, 10000);
    test(`defaults.${prop} is function`, function () {
      expect(libs_defaults[prop]).toBeDefined();
      expect(typeof libs_defaults[prop]).toBe('function');
    }, 10000);
  }
});
