///
import { describe, expect, test } from '@jest/globals';
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import { Application } from '../src';
import validateCopy from './validate-copy';

describe('copy test', function () {
  const api = new Application(process.cwd());

  test('validate cwd', function () {
    expect(api.config.cwd).toEqual(process.cwd());
  });

  describe('run copy', () => {
    return validateCopy(api);
  });
});
