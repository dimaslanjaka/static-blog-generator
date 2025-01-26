// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

import { fixturesCwd, testCwd } from '../env.mjs';

// tell working directory to fixtures folder
process.cwd = () => (typeof testCwd === 'string' ? testCwd : fixturesCwd);

// start import application
import fs from 'fs-extra';
import { normalizePath } from 'sbg-utility';
import { Application } from '../../src';

const api = new Application(fixturesCwd);
// cleanup deployment directory
fs.rmSync(normalizePath(api.cwd, '.deploy_git'), { force: true, recursive: true });
// copy generated hexo site into deployment directory
api.deploy.copy();
