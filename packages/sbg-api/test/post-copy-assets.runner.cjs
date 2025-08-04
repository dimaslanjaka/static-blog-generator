// cross-env-shell DEBUG:post
process.env.DEBUG = 'post:assets,post:assets:*,assets:*,assets';

const { fixturesCwd, testCwd } = require('./env.cjs');

// tell working directory to fixtures folder
process.cwd = function () {
  return typeof testCwd === 'string' ? testCwd : fixturesCwd;
};

// start import application
const { Application, promiseCopyAssets } = require('../dist/index.cjs');

const api = new Application(fixturesCwd);

api.clean('post').then(() => {
  return promiseCopyAssets(api.config);
});
