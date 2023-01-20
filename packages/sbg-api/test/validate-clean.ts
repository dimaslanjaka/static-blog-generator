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
    expect(existsSync(join(__dirname, 'tmp/cache'))).toBeFalsy();
    expect(existsSync(join(__dirname, 'tmp/gulp'))).toBeFalsy();
    expect(existsSync(join(__dirname, api.getConfig().source_dir, '_posts'))).toBeFalsy();
    expect(existsSync(join(__dirname, api.getConfig().source_dir, api.getConfig().public_dir))).toBeFalsy();
    if (existsSync(join(__dirname, '.deploy_' + api.getConfig().deploy.type))) {
      expect(
        existsSync(join(__dirname, '.deploy_' + api.getConfig().deploy.type, api.getConfig().tag_dir))
      ).toBeFalsy();
      expect(
        existsSync(join(__dirname, '.deploy_' + api.getConfig().deploy.type, api.getConfig().category_dir))
      ).toBeFalsy();
    }
  });
}
