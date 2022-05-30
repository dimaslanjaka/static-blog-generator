import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fse, { writeFile } from 'fs-extra';
import { join, toUnix } from 'upath';
import pkg from './package.json';
import { getLatestCommitHash, git } from './src/bin/git';
import { json_encode } from './src/node/JSON';

(async () => {
  if (!process.env['GITHUB_WORKFLOW']) {
    const uuid = randomUUID();
    const hash = await getLatestCommitHash();
    pkg.version = pkg.version.split('-')[0] + '-beta-' + uuid;
    writeFile(join(__dirname, '.guid'), uuid);
    writeFile(join(__dirname, 'package.json'), json_encode(pkg, 2));
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
})();

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
    git({ cwd: __dirname }, 'add', 'dist').then(async () => {
      const comitHash = await getLatestCommitHash();
      git(null, 'commit', '-m', `[${comitHash}] build ${new Date()}`);
    });
  });
}
