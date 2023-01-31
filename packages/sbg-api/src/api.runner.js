// process.cwd = () => __dirname + '/../../sbg-cli/test';

require('ts-node/register');
const { Application } = require('.');
const path = require('upath');

const root = path.resolve(__dirname + '/../../sbg-cli/test');

const api = new Application(root);
async function test() {
  const core = await api.core();
  const getSourcePost = await core.post.getSourcePosts();
  console.log(getSourcePost);
}

test();
