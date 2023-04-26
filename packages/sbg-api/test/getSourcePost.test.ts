import { testCwd } from './env';
process.cwd = () => testCwd;
//
import { describe, expect, test } from '@jest/globals';
import { existsSync } from 'fs';
import path from 'path';
import defaults from '../src';

describe('get source posts', () => {
  const cacheDirectory = path.join(__dirname, '../tmp');
  let posts: defaults.ResultSourcePosts[];

  beforeAll(async () => {
    posts = await defaults.getSourcePosts({
      cwd: testCwd,
      post_dir: 'src-posts',
      cacheDirectory
    });
  }, 90000);

  test('cache exist', async () => {
    expect(existsSync(path.join(cacheDirectory, 'getSourcePosts'))).toBeTruthy();
  });

  test('post length', () => {
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length > 0).toBeTruthy();
  });
});
