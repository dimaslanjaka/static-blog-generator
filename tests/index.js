process.cwd = () => __dirname;

const sbg = require('../dist/src');

console.log('test using local dependencies');
sbg.copyAssets().then((msg) => {
  console.log('ers', msg);
});
