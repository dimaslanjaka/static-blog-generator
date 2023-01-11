import fs from 'fs-extra';
import { createConfig } from 'sbg-utility/dist/config/_config';
import SBGServer from './server';

const DEV_SITE_ROOT = 'D:/Repositories/static-blog-generator/packages/sbg-main/test';

// set default config
const serverConfig = new createConfig<SBGServer['config']>('sbg-server', {
  root: fs.existsSync(DEV_SITE_ROOT) ? DEV_SITE_ROOT : process.cwd(),
  port: 4000
});

export default serverConfig;
