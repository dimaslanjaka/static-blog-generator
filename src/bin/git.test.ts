import { join } from 'path';
import { getLatestCommitHash, git } from './git';

getLatestCommitHash().then((id) => {
  console.log('latest all', id);
});

getLatestCommitHash('src').then((id) => {
  console.log('latest src', id);
});

function _test() {
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
}
