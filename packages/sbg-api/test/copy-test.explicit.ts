import { Application } from '../src';
import { fixturesCwd } from './env';

// tell working directory to fixtures folder
process.cwd = () => fixturesCwd;

const api = new Application(fixturesCwd);
api.clean('post').then(() => {
  api.copy();
});
