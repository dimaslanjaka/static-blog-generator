import { describe, expect, it, test } from '@jest/globals';
import defaults, * as wilcards from '../src';

// jest --runInBand imports.test

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
    test(`wilcards.${prop} is function`, function () {
      expect((wilcards as any)[prop]).toBeDefined();
      expect(typeof (wilcards as any)[prop]).toBe('function');
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
      expect(typeof wilcards.writefile).toEqual('function');
      expect(typeof wilcards.normalizePath).toEqual('function');
      expect(typeof wilcards.normalizePathUnix).toEqual('function');
    });
  });
});
