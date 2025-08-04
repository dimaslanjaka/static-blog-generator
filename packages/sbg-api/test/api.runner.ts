import { Application } from '../src';
import { fixturesCwd } from './env.mjs';

// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

// tell working directory to fixtures folder
process.cwd = () => fixturesCwd;

const api = new Application(fixturesCwd);

async function info() {
  const core = await api.core();
  const rootDir = api.getConfig().cwd;
  console.log(rootDir);
  const getSourcePost = await core.post.getSourcePosts();
  console.log(getSourcePost);
}

info();
