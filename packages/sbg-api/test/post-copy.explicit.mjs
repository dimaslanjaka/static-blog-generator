// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post,clean,clean:*';

import { fixturesCwd, testCwd } from './env.mjs';

// tell working directory to fixtures folder
process.cwd = function () {
  return typeof testCwd === 'string' ? testCwd : fixturesCwd;
};

// start import application
import { Application } from '../dist/index.mjs';

const api = new Application(fixturesCwd);
api
  .clean('post')
  .then(() => {
    return api.copy();
  })
  .catch(console.error);
