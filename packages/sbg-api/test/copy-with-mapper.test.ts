///
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import { describe, expect, test } from '@jest/globals';
import { parsePost } from 'hexo-post-parser';
import path from 'upath';
import { Application } from '../src';
import validateClean from './validate-clean';
import validateCopy from './validate-copy';

describe('test copy post with label mapper', function () {
  const api = new Application(process.cwd(), {
    generator: {
      cache: false,
      verbose: false,
      test: true
    },
    exclude: [],
    permalink: '/:month/:title/',
    tags: { lowercase: true, mapper: { TS: 'typescript', JS: 'javascript' }, assign: { code: 'snippet' } },
    categories: {
      lowercase: true,
      mapper: { TS: 'typescript', JS: 'javascript' },
      assign: { programming: 'javascript' }
    }
  });
  describe('clean', () => {
    return validateClean(api);
  });
  describe('copy', () => {
    return validateCopy(api);
  });
  describe('validate mapped', function () {
    test('label lowercase', async () => {
      const postAssign = path.join(api.config.cwd, 'source/_posts/label-uppercase.md');
      const parsePostAssign = await parsePost(postAssign, {
        config: <any>api.getConfig()
      });
      expect(parsePostAssign).not.toBeUndefined();
      if (parsePostAssign) {
        const { metadata } = parsePostAssign;
        expect(metadata).not.toBeUndefined();
        expect(metadata).toHaveProperty('tags', ['label']);
        expect(metadata).toHaveProperty('categories', ['label']);
      }
    });
    test('label assign (add label based on config.tags|categories.assign key)', async () => {
      const postAssign = path.join(api.config.cwd, 'source/_posts/label-assigner.md');
      const parsePostAssign = await parsePost(postAssign, {
        config: <any>api.getConfig()
      });
      expect(parsePostAssign).not.toBeUndefined();
      if (parsePostAssign) {
        const { metadata } = parsePostAssign;
        expect(metadata).not.toBeUndefined();
        expect(metadata).toHaveProperty('tags', ['code', 'snippet']);
        expect(metadata).toHaveProperty('categories', ['programming', 'javascript']);
      }
    });
    test('label mapper (label replacer)', async () => {
      const postAssign = path.join(api.config.cwd, 'source/_posts/label-mapper.md');
      const parsePostAssign = await parsePost(postAssign, {
        config: <any>api.getConfig()
      });
      expect(parsePostAssign).not.toBeUndefined();
      if (parsePostAssign) {
        const { metadata } = parsePostAssign;
        expect(metadata).not.toBeUndefined();
        expect(metadata).toHaveProperty('tags', ['javascript', 'typescript']);
        expect(metadata).toHaveProperty('categories', ['javascript', 'typescript']);
      }
    });
  });
});
