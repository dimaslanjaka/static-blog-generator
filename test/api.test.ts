/* eslint-disable @typescript-eslint/no-var-requires */
process.cwd = () => require('upath').toUnix(__dirname);

import { describe, expect, jest, test } from '@jest/globals';
import { existsSync } from 'fs';
import { join } from 'upath';
import { Application, ProjectConfig } from '../src';

describe('API', function () {
  jest.spyOn(process, 'cwd');
  const app = new Application(__dirname);

  test('cwd is test', function () {
    expect(process.cwd()).toBe(require('upath').toUnix(__dirname));
  });

  test('Clean', async function () {
    await app.clean();
    expect(existsSync(join(__dirname, 'tmp'))).toBe(false);
    expect(existsSync(join(__dirname, 'source/_posts'))).toBe(false);
    expect(existsSync(join(__dirname, ProjectConfig.public_dir || 'public'))).toBe(false);
  });

  //await app.copy();
  //await app.generate();
});
