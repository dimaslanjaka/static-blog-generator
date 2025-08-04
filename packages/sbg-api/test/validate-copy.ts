///
import { expect, test } from '@jest/globals';
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import fs from 'fs-extra';
import path from 'path';
import { Application } from '../src';

export default function validateCopy(api: Application) {
  test('run copy', function (done) {
    api.copy().then(() => done());
  }, 600000);
  test('validate total markdown', function () {
    expect(fs.readdirSync(path.join(api.config.cwd, api.config.source_dir, '_posts')).length).toBeGreaterThan(8);
  }, 600000);
}
