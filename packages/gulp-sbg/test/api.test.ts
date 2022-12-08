import { toUnix } from 'upath';
import { Application } from '..';
const cwd = toUnix(__dirname);
process.cwd = () => cwd;

(async function () {
  const c = new Application(cwd);
  // await c.copy();
  // await c.generate();
})();
