import { describe, expect, it, jest, test } from '@jest/globals';
import defaults, * as wildcards from '../dist/index.mjs';
import * as shared from './import-shared.cjs';

// avoid jest error **trying to `import` a file after the Jest environment has been torn down**
jest.useFakeTimers();

/**
 * Tests for the methods in the wildcards and defaults modules.
 */
describe('check method', () => {
  const props = shared.properties;

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];

    /**
     * Tests if the method in the wildcards module is a function.
     */
    test(`wildcards.${prop} is function`, function () {
      expect(wildcards[prop]).toBeDefined();
      expect(typeof wildcards[prop]).toBe('function');
    }, 10000);

    /**
     * Tests if the method in the defaults module is a function.
     */
    test(`defaults.${prop} is function`, function () {
      expect(defaults[prop]).toBeDefined();
      expect(typeof defaults[prop]).toBe('function');
    }, 10000);
  }

  describe('is function', function () {
    /**
     * Tests JSON.stringifyWithCircularRefs and defaults.jsonParseWithCircularRefs.
     */
    it('JSON with circular helpers', function () {
      expect(typeof JSON.stringifyWithCircularRefs === 'function').toBeTruthy();
      expect(typeof defaults.jsonParseWithCircularRefs === 'function').toBeTruthy();
    });

    /**
     * Tests file manager methods in the wildcards module.
     */
    it('file manager', () => {
      expect(typeof wildcards.writefile).toEqual('function');
      expect(typeof wildcards.normalizePath).toEqual('function');
      expect(typeof wildcards.normalizePathUnix).toEqual('function');
      expect(typeof wildcards.resolveCommand).toEqual('function');
    });
  });
});
