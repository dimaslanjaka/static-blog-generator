// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

import { fixturesCwd, testCwd } from './env.cjs';

// Tell working directory to fixtures folder
process.cwd = (): string => (typeof testCwd === 'string' ? testCwd : fixturesCwd);

import { Application, getSourcePosts, parseMarkdownPost } from '../src';

const api = new Application(fixturesCwd);

async function main() {
  // await api.clean('post');
  const sourcePosts: string[] = await getSourcePosts(api.config);
  console.log('got', sourcePosts.length, 'post(s)');

  for (let i = 0; i < sourcePosts.length; i++) {
    const file = sourcePosts[i];
    console.log('processing', file);

    try {
      await parseMarkdownPost({ file }, api.config, function (result) {
        if (result && result.metadata) {
          console.log(result.metadata.title, result.fileTree, result.metadata.permalink);
        } else {
          console.log('metadata undefined', file, Object.keys(result));
        }
      });
    } catch (e) {
      console.error('fail processing', file, e);
    }
  }
}

main();
