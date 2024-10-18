// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

const { fixturesCwd, testCwd } = require('./env.cjs');

// tell working directory to fixtures folder
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);

// start import application
const { Application } = require('../dist/src/index.cjs');
const getSourcePosts = require('../dist/src/post/get-source-posts.cjs').default;
const { parseMarkdownPost } = require('../dist/src/post/copy-utils.cjs');

const api = new Application(fixturesCwd);

async function main() {
  await api.clean('post');
  const sourcePosts = await getSourcePosts(api.config);
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
