import { describe, expect, it, test } from '@jest/globals';
import defaults, * as wilcards from '../src';

// jest --runInBand imports.test

describe('check method', () => {
  const props = [
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
    'jsonStringifyWithCircularRefs'
  ];

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

  it('JSON.stringifyWithCircularRefs is function', function () {
    expect(typeof JSON.stringifyWithCircularRefs === 'function').toBeTruthy();
  });
});
