process.cwd = () => __dirname;
process.env['NODE_ENV'] = 'development';

import { copyPosts } from '../src';

console.log('[TS] copying source posts');
//sbg.clean_posts();
//sbg.copyAssets();
copyPosts();
