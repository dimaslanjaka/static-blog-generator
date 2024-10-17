// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

import { fixturesCwd, testCwd } from './env.mjs';

// tell working directory to fixtures folder
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);

// start import application
import { Application } from '../src';

const api = new Application(fixturesCwd);
api.clean('post');
