import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fse, { writeFile } from 'fs-extra';
import { join, toUnix } from 'upath';
import { getLatestCommitHash, git } from './src/bin/git';

if (!process.env['GITHUB_WORKFLOW']) {
  const uuid = randomUUID();
  writeFile(join(__dirname, '.guid'), uuid);
  // commit uuid
  git(null, 'add', '.guid').then(() => {
    git(null, 'commit', '-m', `update cache id ${uuid}`).then(() => {
      build();
    });
  });
} else {
  console.log('not updating the uuid on github workflow');
  build();
}

/**
 * main build function
 */
function build() {
  fse.emptyDirSync(join(__dirname, 'dist'));
  const summon = spawn('tsc', ['-p', 'tsconfig.build.json'], {
    cwd: toUnix(__dirname),
    stdio: 'inherit',
    shell: true
  });
  summon.once('close', () => {
    git(null, 'add', 'dist').then(() => {
      git(
        null,
        'commit',
        '-m',
        `[${getLatestCommitHash()}] build ${new Date()}`
      );
    });
  });
}
