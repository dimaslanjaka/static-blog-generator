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

  test('Clean auto generated files', function (done) {
    app.clean().then(() => {
      expect(existsSync(join(__dirname, 'tmp'))).toBe(false);
      expect(existsSync(join(__dirname, 'source/_posts'))).toBe(false);
      expect(existsSync(join(__dirname, getConfig().public_dir || 'public'))).toBe(false);
      done();
    });
  });

  test('Run standalone', function (done) {
    app.standalone().once('end', function () {
      done();
    });
  });

  test('Copy source posts', function (done) {
    // expect.assertions(1);
    app.copy().then(() => {
      expect(existsSync(join(__dirname, 'source/_posts'))).toBe(true);
      done();
    });
  });

  //await app.generate();
});
