process.cwd = () => __dirname;

const sbg = require('../dist/src');
const sbg2 = require('static-blog-generator');

console.log('test using local dependencies');
test(sbg);
console.log('test using remote dependencies');
test(sbg2);

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
