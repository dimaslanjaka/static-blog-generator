process.cwd = () => __dirname;

import { existsSync } from 'fs';
import { join } from 'path';
import { Application, cleanDb, copyAllPosts } from '../src';
import { chain } from '../src/utils/chain';
import { writefile } from '../src/utils/fm';

const after = (filename: string) => {
  return () => {
    writefile(
      join(__dirname, 'results/' + filename + '.json'),
      JSON.stringify({
        'source/_posts': existsSync(join(__dirname, 'source/_posts'))
      })
    );
    cleanDb();
  };
};

chain([
  {
    callback: copyAllPosts,
    opt: {
      before: () => console.log('='.repeat(16) + '[ DIRECT ]' + '='.repeat(16)),
      after: after('copyAllPosts')
    }
  },
  {
    callback: new Application(__dirname).copy,
    opt: {
      before: () => console.log('='.repeat(20) + '[ API ]' + '='.repeat(20)),
      after: after('Application-Copy')
    }
  }
]);
