process.cwd = () => __dirname;
process.env['NODE_ENV'] = 'development';

const sbg = require('static-blog-generator');

console.log('test using local dependencies');
//sbg.dumpEnv();
sbg.clean_posts();
