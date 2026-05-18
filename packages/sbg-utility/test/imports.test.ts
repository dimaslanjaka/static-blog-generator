import { describe, expect, it, jest, test } from '@jest/globals';
import defaults, * as wildcards from '../src';
import * as shared from './import-shared.cjs';

// jest --runInBand imports.test

// avoid jest error **trying to `import` a file after the Jest environment has been torn down**
jest.useFakeTimers();

describe('check method', () => {
  const props = shared.properties;

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    test(`wildcards.${prop} is function`, function () {
      expect((wildcards as any)[prop]).toBeDefined();
      expect(typeof (wildcards as any)[prop]).toBe('function');
    }, 10000);
    test(`defaults.${prop} is function`, function () {
      expect((defaults as any)[prop]).toBeDefined();
      expect(typeof (defaults as any)[prop]).toBe('function');
    }, 10000);
  }

  describe('is function', function () {
    it('JSON with circular helpers', function () {
      expect(typeof JSON.stringifyWithCircularRefs === 'function').toBeTruthy();
      expect(typeof defaults.jsonParseWithCircularRefs === 'function').toBeTruthy();
    });
    it('file manager', () => {
      expect(typeof wildcards.writefile).toEqual('function');
      expect(typeof wildcards.normalizePath).toEqual('function');
      expect(typeof wildcards.normalizePathUnix).toEqual('function');
    });
  });
});
