import { buildPost, parsePost } from 'hexo-post-parser';
import moment from 'moment-timezone';
import { path, writefile } from 'sbg-utility';
import { Application, processSinglePost } from '../src';
import { fixturesCwd } from './env';

// cross-env-shell DEBUG:post
process.env.DEBUG = "sbg-*,post:*,post"

// tell working directory to fixtures folder
process.cwd = () => fixturesCwd;
const postPath = path.join(fixturesCwd, 'src-posts/future-post.md');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const api = new Application(fixturesCwd);
// api.clean('post').then(() => {
//   api.copy();
// });

rebuildPostDate('3000-01-21T09:54:43.398Z').then((result) => console.log(typeof result !== 'string'));
rebuildPostDate('2024-01-20T09:54:43.398Z').then((result) => console.log(typeof result === 'string'));

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
