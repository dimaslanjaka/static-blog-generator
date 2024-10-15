///
import { beforeAll, describe, expect, test } from '@jest/globals';
import { fixturesCwd, testCwd } from './env.mjs';
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);
///

import path from 'path';
import defaults from '../src';

describe('get source posts', () => {
  const cacheDirectory = path.join(__dirname, '../tmp');
  let posts: defaults.ResultSourcePosts[];

  beforeAll(async () => {
    posts = await defaults.getSourcePosts({
      cwd: process.cwd(),
      post_dir: 'src-posts',
      cacheDirectory
    });
  }, 90000);

  test('post length > 0', () => {
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length > 0).toBeTruthy();
  });
});
