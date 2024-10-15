// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

// tell working directory to fixtures folder
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);

import { Application } from '../src';
import { fixturesCwd, testCwd } from './env.mjs';

const api = new Application(fixturesCwd);
api.clean('post').then(() => {
  api.copy();
});
