import { spawn } from 'child_process';
import fse, { writeFile } from 'fs-extra';
import { join, toUnix } from 'upath';
import pkg from './package.json';
import { getLatestCommitHash, git, gitAddAndCommit } from './src/bin/git';
import { json_encode } from './src/node/JSON';

(async () => {
  if (!process.env['GITHUB_WORKFLOW']) {
    const id = await getLatestCommitHash();
    pkg.version = pkg.version.split('-')[0] + '-beta-' + id;
    writeFile(join(__dirname, '.guid'), id);
    writeFile(join(__dirname, 'package.json'), json_encode(pkg, 2) + '\n');
    // commit uuid
    await gitAddAndCommit('.guid', `update cache id ${id}`, { cwd: __dirname });
    await gitAddAndCommit('package.json', `beta-${id}`, {
      cwd: __dirname
    });
  }
  build();
})();

/**
 * main build function
 */
async function build() {
  fse.emptyDirSync(join(__dirname, 'dist'));
  const child = spawn('tsc', ['-p', 'tsconfig.build.json'], {
    cwd: toUnix(__dirname),
    stdio: 'inherit',
    shell: true
  });
  child.once('close', async () => {
    await git({ cwd: __dirname }, 'add', 'dist');
    const id = await getLatestCommitHash();
    return await git(
      { cwd: __dirname },
      'commit',
      '-m',
      `build ${id} ${new Date()}`
    );
  });
  return child;
}
