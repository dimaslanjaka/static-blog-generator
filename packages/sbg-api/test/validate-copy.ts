///
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import { expect, test } from '@jest/globals';
import { readdirSync } from 'fs-extra';
import { join } from 'path';
import { Application } from '../src';

export default function validateCopy(api: Application) {
  test('run copy', function (done) {
    api.copy().then(() => done());
  }, 600000);
  test('validate total markdown', function () {
    expect(readdirSync(join(api.config.cwd, api.config.source_dir, '_posts')).length).toBeGreaterThan(8);
  }, 600000);
}
