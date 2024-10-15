import { spawnAsync } from 'cross-spawn';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectCwd = path.resolve(__dirname, '../');
console.log('Project directory', projectCwd);
const testCwd = path.resolve(__dirname, '../../../test');
console.log('Working directory', testCwd);

async function _main() {
  console.log('Installing...');
  await spawnAsync('yarn', ['add', 'sbg-api@workspace:^', 'sbg-utility@workspace:^', 'sbg-cli@workspace:^'], {
    cwd: testCwd,
    stdio: 'inherit'
  });
  console.log('Installation finished');
  await spawnAsync('sbg', ['--help'], { cwd: testCwd, stdio: 'inherit' });
  await spawnAsync('sbg', ['--version'], { cwd: testCwd, stdio: 'inherit' });
}

_main();
