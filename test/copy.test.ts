import { toUnix } from 'upath';
process.cwd = () => toUnix(__dirname);

import { Application, cleanDb, copyAllPosts } from '../src';
import { chain } from '../src/utils/chain';

chain([
  {
    callback: copyAllPosts,
    opt: { before: () => console.log('='.repeat(16) + '[ DIRECT ]' + '='.repeat(16)), after: () => cleanDb() }
  },
  {
    callback: () => new Application(__dirname).copy(),
    opt: {
      before: () => console.log('='.repeat(20) + '[ API ]' + '='.repeat(20)),
      after: () => new Application(__dirname).clean()
    }
  }
]);
