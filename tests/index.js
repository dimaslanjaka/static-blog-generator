process.cwd = () => __dirname;

const sbg = require('../dist/src');

console.log('test using local dependencies');
test(sbg);

/**
 * test runner
 * @param {typeof sbg} sbg
 */
function test(sbg) {
  // clean
  sbg.clean_db(null);
  sbg.clean_posts(null);
  sbg.clean_tmp(null);
  sbg.clean_public(null);

  // copy posts
  //sbg.copyPosts();
  //sbg.copyAssets();
}
module.exports = { test };
