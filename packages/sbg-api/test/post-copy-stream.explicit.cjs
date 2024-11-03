// cross-env-shell DEBUG:post
// process.env.DEBUG = 'sbg-*,post:*,post,clean,clean:*';

const { fixturesCwd, testCwd } = require('./env.cjs');

// tell working directory to fixtures folder
process.cwd = function () {
  return typeof testCwd === 'string' ? testCwd : fixturesCwd;
};

// start import application
const { Application } = require('../dist/index.cjs');

const api = new Application(fixturesCwd);
if (!api.config.exclude) api.config.exclude = [];
// api.config.exclude = [...api.config.exclude, '**/node_modules/**', '**/tmp/**', '**/.git/**'];
api.clean('post').then(() => {
  return api.copyStream();
});
