/* eslint-disable @typescript-eslint/no-var-requires */
process.cwd = () => __dirname;

import { describe, expect, jest, test } from '@jest/globals';
import { existsSync } from 'fs';
import { join } from 'upath';
import { Application, copyAllPosts } from '../src';

describe('API - Copy', function () {
  jest.setTimeout(60000);

  test('Direct method', function (done) {
    copyAllPosts().once('end', done);
  }, 60000);

  test('API method', function (done) {
    expect.assertions(1);
    const app = new Application(__dirname);
    app
      .copy()
      .then(() => {
        expect(existsSync(join(__dirname, 'source/_posts'))).toBe(true);
        done();
      })
      .catch(console.log);
  }, 10000);

  //await app.generate();
});
