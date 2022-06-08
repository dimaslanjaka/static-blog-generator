process.cwd = () => __dirname;

/**
 * test runner
 * @param {import('../dist/src')} sbg
 * @param {'clean'|'copy'} type
 */
function test(sbg, type) {
  // clean
  if (type === 'clean') {
    console.log('clean');
    sbg.clean_db(null);
    sbg.clean_posts(null);
    sbg.clean_tmp(null);
    sbg.clean_public(null);
  }

  // copy posts
  if (type === 'copy') {
    sbg.copyPosts(null);
    sbg.copyAssets(null);
  }
}

module.exports = { test };
