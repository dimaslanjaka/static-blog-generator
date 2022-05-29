import { join } from 'path';
import { git } from './git';

git(
  {
    cwd: join(__dirname, '../../')
  },

  'rev-parse',
  '--short',
  'HEAD'
).then((res) => {
  console.log(res);
});
