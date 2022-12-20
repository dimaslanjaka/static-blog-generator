/* eslint-disable @typescript-eslint/no-var-requires */
process.cwd = () => __dirname;

import { describe, expect, jest, test } from '@jest/globals';
import { existsSync } from 'fs';
import { join, toUnix } from 'upath';
import { Application, getConfig } from '../src';

jest.setTimeout(10000);

describe('API', function () {
  jest.spyOn(process, 'cwd');
  const app = new Application(__dirname);

  test('cwd is test folder', function () {
    expect(toUnix(process.cwd())).toBe(toUnix(__dirname));
  });

  test('Clean auto generated files', async function () {
    await app.clean();
    expect(existsSync(join(__dirname, 'tmp'))).toBe(false);
    expect(existsSync(join(__dirname, 'source/_posts'))).toBe(false);
    expect(existsSync(join(__dirname, getConfig().public_dir || 'public'))).toBe(false);
  });

  test('Copy source posts', async function () {
    expect.assertions(1);
    await app.copy();
    expect(existsSync(join(__dirname, 'source'))).toBe(true);
  });

  //await app.generate();
});
