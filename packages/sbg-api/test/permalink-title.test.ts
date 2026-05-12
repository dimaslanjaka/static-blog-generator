///
import { describe, expect, jest, test } from '@jest/globals';
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import { parsePost } from 'hexo-post-parser';
import moment from 'moment';
import { normalizePathUnix } from 'sbg-utility';
import { Application } from '../src';
import validateClean from './validate-clean';
import validateCopy from './validate-copy';

// avoid jest error "trying import after jest env has been torn down"
jest.useFakeTimers();

describe('permalink', function () {
  /**
   * Validates that the parsed permalink of a post matches the expected value.
   *
   * @param postPath - The path to the markdown post file.
   * @param expected - The expected permalink value.
   * @returns A promise that resolves when the validation is complete.
   */
  async function validatePermalink(postPath: string, expected: string) {
    const parse = await parsePost(postPath);
    expect(parse.metadata).not.toBeUndefined();
    if (parse.metadata) {
      expect(parse.metadata.permalink).not.toBeUndefined();
      expect(parse.metadata.permalink).toBe(expected);
    }
  }

  describe(':title.html', function () {
    const api = new Application(process.cwd(), {
      generator: {
        cache: false,
        verbose: false,
        test: true
      },
      exclude: [],
      permalink: ':title.html'
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
          normalizePathUnix(api.config.cwd, '/source/_posts/with-permalink.md'),
          moment().format('YYYY/MM/') + 'with-permalink.html'
        ));

      test('post without permalink', () =>
        validatePermalink(
          normalizePathUnix(api.config.cwd, '/source/_posts/without-permalink.md'),
          'without-permalink.html'
        ));
    });
  });
});
