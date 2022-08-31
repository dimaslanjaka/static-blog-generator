import git from '../../../node/git';

const gitDirWithSubmodule = process.cwd();
git(
  { stdio: 'pipe', cwd: gitDirWithSubmodule },
  'submodule',
  'status',
  '--recursive'
).then((o) => {
  if ('stdout' in o) {
    if (Array.isArray(o.stdout) && o.stdout.length > 0) {
      //
    }
  }
});
