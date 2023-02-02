import fs from 'fs-extra';
import path from 'upath';
import git from './packages/git-command-helper';

const repo = 'https://github.com/dimaslanjaka/static-blog-generator';
const branch = 'master';

const base = path.join(__dirname, 'dist');

export async function commitDist(done: (...args: any[]) => any) {
  // clone when not exist
  if (!fs.existsSync(base)) {
    await git.ext.spawnAsync('git', ['clone', '-b', branch, '--single-branch', repo, base], {
      cwd: __dirname,
      stdio: 'inherit'
    });
  }
  const rootgh = new git(__dirname);
  rootgh.latestCommit(null, { cwd: __dirname }).then(async (hash) => {
    const distgh = new git(base);
    if (await distgh.hasChanged()) {
      await distgh.add('-A').catch(rootgh.noop);
      await distgh.commit(`chore(dist): update build (${repo}/commit/${hash})`).catch(rootgh.noop);
      if (await distgh.canPush()) {
        await distgh.push();
      }
    }
    if (typeof done === 'function') done();
  });
}
