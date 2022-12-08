import { toUnix } from 'upath';
import { Application } from '../src';
const cwd = toUnix(__dirname);
process.cwd = () => cwd;

(async function () {
  const app = new Application(cwd);
  // await c.copy();
  // await c.generate();
})();
