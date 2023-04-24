///
import { testCwd } from './env';
process.cwd = () => testCwd;
///

import { expect, test } from '@jest/globals';
import { existsSync } from 'fs';
import { join } from 'upath';
import { Application } from '../src';

export default function validateClean(api: Application) {
  test('run clean', (done) => {
    api.clean().then(() => done());
  }, 60000);

  test('validate clean', () => {
    expect(existsSync(join(api.config.cwd, 'tmp/cache'))).toBeFalsy();
    expect(existsSync(join(api.config.cwd, 'tmp/gulp'))).toBeFalsy();
    expect(existsSync(join(api.config.cwd, api.config.source_dir, '_posts'))).toBeFalsy();
    expect(existsSync(join(api.config.cwd, api.config.source_dir, api.config.public_dir))).toBeFalsy();
    if (existsSync(join(api.config.cwd, '.deploy_' + api.config.deploy.type))) {
      expect(existsSync(join(api.config.cwd, '.deploy_' + api.config.deploy.type, api.config.tag_dir))).toBeFalsy();
      expect(
        existsSync(join(api.config.cwd, '.deploy_' + api.config.deploy.type, api.config.category_dir))
      ).toBeFalsy();
    }
  }, 60000);
}
