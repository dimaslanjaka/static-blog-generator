process.cwd = () => __dirname;

const sbg = require('static-blog-generator');

console.log('test using local dependencies');
sbg.copyAssets();
