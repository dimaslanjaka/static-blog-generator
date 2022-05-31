process.cwd = () => __dirname;

/**
 * test runner
 * @param {import('../dist/src')} sbg
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
