import { toUnix } from 'upath';
import { Application } from '../src';
const cwd = toUnix(__dirname);
process.cwd = () => cwd;

(async function () {
  const app = new Application(cwd);
  await app.clean();
  await app.copy();
  // await c.generate();
})();
