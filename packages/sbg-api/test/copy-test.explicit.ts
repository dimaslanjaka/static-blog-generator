import { Application } from '../src';
import { testCwd } from './env';

const api = new Application(testCwd);
api.copy();
