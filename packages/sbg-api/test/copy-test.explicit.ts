import { Application } from '../src';
import { fixturesCwd } from './env';

const api = new Application(fixturesCwd);
api.copy();
