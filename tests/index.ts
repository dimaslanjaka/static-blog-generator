process.cwd = () => __dirname;
process.env['NODE_ENV'] = 'development';

import sbg from '../src';

console.log('test using local dependencies');
sbg.clean_posts();
//sbg.copyAssets();
sbg.copyPosts();
