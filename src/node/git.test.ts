import { join } from 'path';
import { getLatestCommitHash, git, gitDescribe } from './git';

getLatestCommitHash().then((id) => {
  console.log('latest all', id);
});

getLatestCommitHash('src').then((id) => {
  console.log('latest src', id);
});

gitDescribe().then((ver) => {
  console.log('version', ver);
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
