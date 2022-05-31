process.cwd = () => __dirname;

const GulpClient = require('gulp');
const sbg = require('../dist/src');

console.log('test using local dependencies');
GulpClient.series(sbg.copyAssets)(null);
