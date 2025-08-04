///
import { expect, test } from '@jest/globals';
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import fs from 'fs';
import path from 'upath';
import { Application } from '../src';

export default function validateClean(api: Application) {
  test('run clean', (done) => {
    api.clean().then(() => done());
  }, 60000);

  test('validate clean', () => {
    expect(fs.existsSync(path.join(api.config.cwd, 'tmp/cache'))).toBeFalsy();
    expect(fs.existsSync(path.join(api.config.cwd, 'tmp/gulp'))).toBeFalsy();
    expect(fs.existsSync(path.join(api.config.cwd, api.config.source_dir, '_posts'))).toBeFalsy();
    expect(fs.existsSync(path.join(api.config.cwd, api.config.source_dir, api.config.public_dir))).toBeFalsy();
    if (fs.existsSync(path.join(api.config.cwd, '.deploy_' + api.config.deploy.type))) {
      expect(
        fs.existsSync(path.join(api.config.cwd, '.deploy_' + api.config.deploy.type, api.config.tag_dir))
      ).toBeFalsy();
      expect(
        fs.existsSync(path.join(api.config.cwd, '.deploy_' + api.config.deploy.type, api.config.category_dir))
      ).toBeFalsy();
    }
  }, 60000);
}
