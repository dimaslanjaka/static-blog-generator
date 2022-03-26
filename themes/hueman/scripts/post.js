/*const console = require('hexo-log')({
  debug: false,
  silent: false,
});*/

const myParseDate = (date_string) => {
  let [y, M, d, h, m, s] = date_string.split(/[- :T]/);
  return new Date(y, parseInt(M) - 1, d, h, parseInt(m), s.replace('Z', ''));
};
hexo.extend.helper.register('myParseDate', myParseDate);

/**
 * List post by updated date
 * @param {object} posts
 * @returns
 */
function list_post_by_updated(posts) {
  return posts;
}

hexo.extend.helper.register('list_post_by_updated', function (posts) {
  return list_post_by_updated(posts);
});
