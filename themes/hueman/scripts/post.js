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
 * @param {Array<object>} posts
 * @returns
 */
function list_post_by_updated(posts) {
  console.log(process.env.NODE_OPTIONS);
  if (typeof process.env.NODE_OPTIONS == 'string' && process.env.NODE_OPTIONS.includes('max_old_space_size')) {
    return posts.sort(function (a, b) {
      if (a.updated && b.updated) {
        return myParseDate(b.updated) - myParseDate(a.updated);
      } else if (a.hasOwnProperty('updated')) {
        return -1;
      } else if (b.hasOwnProperty('updated')) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  return posts;
}

hexo.extend.helper.register('list_post_by_updated', function (posts) {
  return list_post_by_updated(posts);
});
