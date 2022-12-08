/* eslint-disable @typescript-eslint/no-var-requires */
process.cwd = () => require('upath').toUnix(__dirname);

import { existsSync } from 'fs';
import { join } from 'upath';
import { Application, ProjectConfig } from '../src';

(async function () {
  const app = new Application(process.cwd());
  await app.clean();
  console.log('tmp', !existsSync(join(__dirname, 'tmp')));
  console.log('source/_posts', !existsSync(join(__dirname, 'source/_posts')));
  if (!ProjectConfig.public_dir) throw new Error('public_dir not settled in _config.yml');
  console.log('public_dir', !existsSync(join(__dirname, ProjectConfig.public_dir || 'public')));
  //await app.copy();
  // await c.generate();
})();
