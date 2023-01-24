import fs from 'fs-extra';
import path from 'upath';
import * as git from './packages/git-command-helper/src';

const repo = 'https://github.com/dimaslanjaka/static-blog-generator.git';
const branch = 'master';
const base = path.join(__dirname, 'dist');

(async function () {
  if (!fs.existsSync(base)) {
    await git.ext.spawnAsync('git', ['clone', '-b', branch, '--single-branch', repo, base], {
      cwd: __dirname,
      stdio: 'inherit'
    });
  }
  const gh = new git.default(base);
})();
