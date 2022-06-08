process.cwd = () => __dirname;
process.env['NODE_ENV'] = 'development';

const sbg = require('static-blog-generator');

console.log('[JS] cleaning generated posts');
sbg.clean_posts();
