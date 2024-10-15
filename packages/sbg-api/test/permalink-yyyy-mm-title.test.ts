///
import { describe, expect, test } from '@jest/globals';
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import { parsePost } from 'hexo-post-parser';
import moment from 'moment';
import { join } from 'path';
import { Application } from '../src';
import validateClean from './validate-clean';
import validateCopy from './validate-copy';

describe('permalink', function () {
  async function validatePermalink(postPath: string, expected: string) {
    const parse = await parsePost(postPath);
    expect(parse.metadata).not.toBeUndefined();
    if (parse.metadata) {
      expect(parse.metadata.permalink).not.toBeUndefined();
      expect(parse.metadata.permalink).toBe(expected);
    }
  }

  describe('/:year/:month/:title/', function () {
    const api = new Application(process.cwd(), {
      generator: {
        cache: false,
        verbose: false,
        test: true
      },
      exclude: [],
      permalink: '/:year/:month/:title/'
    });
    describe('clean', () => {
      return validateClean(api);
    });
    describe('copy', () => {
      return validateCopy(api);
    });
    describe('validate', function () {
      test('post with custom permalink', () =>
        validatePermalink(
          join(api.config.cwd, '/source/_posts/with-permalink.md'),
          moment().format('YYYY/MM/') + 'with-permalink.html'
        ));

      test('post without permalink', () =>
        validatePermalink(
          join(api.config.cwd, '/source/_posts/without-permalink.md'),
          moment().format('YYYY/MM/') + 'without-permalink/'
        ));
    });
  });
});
