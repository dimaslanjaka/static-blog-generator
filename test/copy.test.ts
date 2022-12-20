import { toUnix } from 'upath';
process.cwd = () => toUnix(__dirname);

import { Application, copyAllPosts } from '../src';
import { chain } from '../src/utils/chain';

chain([
  { callback: copyAllPosts, opt: { before: () => console.log('[direct]') } },
  {
    callback: function () {
      const app = new Application(__dirname);
      app.copy();
    },
    opt: {
      before: () => console.log('[api]')
    }
  }
]);
