///
import { fixturesCwd } from './env.mjs';
process.cwd = () => fixturesCwd;
///

import { Application } from '../src';

const api = new Application(process.cwd(), {
  generator: {
    cache: false,
    verbose: false,
    test: true
  },
  exclude: [],
  permalink: ':title.html'
});
api.findBrokenImages();
