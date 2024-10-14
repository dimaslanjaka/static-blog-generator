import { describe, expect, test } from '@jest/globals';
import { buildPost, parsePost } from 'hexo-post-parser';
import moment from 'moment-timezone';
import { path, writefile } from 'sbg-utility';
import { processSinglePost } from '../src';
import { fixturesCwd } from './env';

// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

// tell working directory to fixtures folder
process.cwd = () => fixturesCwd;
const postPath = path.join(fixturesCwd, 'src-posts/future-post.md');

export async function rebuildPostDate(creationDate: string) {
  const date = moment(creationDate);
  const post = await parsePost(postPath);
  if (post.metadata) {
    // modify meta published date and modified date
    post.metadata.date = date.format();
    post.metadata.updated = date.add(1, 'hour').format();
  }
  const built = buildPost(post);
  // rewrite post
  writefile(postPath, built);
  // process post
  return processSinglePost(postPath);
}

describe('check method', () => {
  test('post length > 0', async () => {
    rebuildPostDate('3000-01-21T09:54:43.398Z');
    rebuildPostDate('2024-01-20T09:54:43.398Z');
    expect(await rebuildPostDate('3000-01-21T09:54:43.398Z')).toBeFalsy();
    expect(await rebuildPostDate('2024-01-20T09:54:43.398Z')).toBeTruthy();
  });
});
