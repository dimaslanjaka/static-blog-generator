import fs from 'fs-extra';
import { createConfig } from 'sbg-utility/dist/config/_config';
import SBGServer from './server';
import path from 'upath';

const DEV_SITE_ROOT = path.join(__dirname, '../../../test'); // 'D:/Repositories/static-blog-generator/test';

// set default config
const serverConfig = new createConfig<SBGServer['config']>('sbg-server', {
  root: fs.existsSync(DEV_SITE_ROOT) ? DEV_SITE_ROOT : process.cwd(),
  port: 4000
});

export default serverConfig;
