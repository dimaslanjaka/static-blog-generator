import { join } from 'path';
import { getLatestCommitHash, git, gitDescribe } from '.';

getLatestCommitHash().then((id) => {
  console.log('latest commit all', id);
});

getLatestCommitHash('src').then((id) => {
  console.log('latest commit folder src', id);
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
