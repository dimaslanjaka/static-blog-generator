/* eslint-disable @typescript-eslint/no-var-requires */
process.cwd = () => __dirname;

import { describe, expect, jest, test } from '@jest/globals';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { spawn } from 'hexo-util';
import { join, toUnix } from 'upath';
import { getConfig, noop } from '../src';

jest.setTimeout(10000);

describe('API', function () {
  jest.spyOn(process, 'cwd');

  test('cwd is test folder', function () {
    expect(toUnix(process.cwd())).toBe(toUnix(__dirname));
  });

  test('Clean auto generated files', function (done) {
    spawn('ts-node', [join(__dirname, 'clean.test.ts')], { cwd: __dirname })
      .then(() => {
        expect(existsSync(join(__dirname, 'tmp'))).toBe(false);
        expect(existsSync(join(__dirname, 'source/_posts'))).toBe(false);
        expect(existsSync(join(__dirname, getConfig().public_dir || 'public'))).toBe(false);
      })
      .catch(noop)
      .finally(done);
  });

  test('Copy source posts', function (done) {
    spawn('ts-node', [join(__dirname, 'copy.test.ts')], { cwd: __dirname })
      .then(function () {
        [join(__dirname, 'results/Application-Copy.json'), join(__dirname, 'results/copyAllPosts.json')].forEach(
          function (path) {
            const obj = JSON.parse(readFileSync(path, 'utf-8'));
            const result = obj['source/_posts'] === true;
            expect(result).toBe(true);
            unlinkSync(path);
          }
        );
      })
      .catch(noop)
      .finally(done);
  }, 60000);

  //await app.generate();
});
