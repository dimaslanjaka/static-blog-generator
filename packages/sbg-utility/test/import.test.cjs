const { describe, expect, it, test } = require('@jest/globals');
const defaults = require('../dist/index.cjs').default;
const wilcards = require('../dist/index.cjs');

/**
 * Tests for the methods in the wilcards and defaults modules.
 */
describe('check method', () => {
  const props = [
    'getConfig',
    'fetchConfig',
    'findYarnRootWorkspace',
    'chain',
    'debug',
    'createWriteStream',
    'debug',
    'Logger',
    'scheduler',
    'noop',
    'envNunjucks',
    'array_random',
    'array_unique',
    'array_remove_empty',
    'image_base64_encode',
    'capitalizer',
    'capitalize',
    'data_to_hash',
    'file_to_hash',
    'normalizePath',
    'pathJoin',
    'joinPath',
    'sitemapCrawler',
    'sitemapCrawlerAsync',
    'SiteMapCrawler',
    'jsonStringifyWithCircularRefs',
    'writefile'
  ];

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];

    /**
     * Tests if the method in the wilcards module is a function.
     */
    test(`wilcards.${prop} is function`, function () {
      expect(wilcards[prop]).toBeDefined();
      expect(typeof wilcards[prop]).toBe('function');
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
     * Tests file manager methods in the wilcards module.
     */
    it('file manager', () => {
      expect(typeof wilcards.writefile).toEqual('function');
      expect(typeof wilcards.normalizePath).toEqual('function');
      expect(typeof wilcards.normalizePathUnix).toEqual('function');
    });
  });
});
