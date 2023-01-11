import fs from 'fs-extra';
import { createConfig } from 'sbg-utility/dist/config/_config';

const SITE_ROOT = 'D:/Repositories/static-blog-generator/packages/sbg-main/test';

export interface SBGServer {
  config: {
    root: string;
  };
}

const serverConfig = new createConfig<SBGServer['config']>('sbg-server', {
  root: fs.existsSync(SITE_ROOT) ? SITE_ROOT : process.cwd()
});

export default serverConfig;
