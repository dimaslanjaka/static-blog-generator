const console = require('hexo-log')({
  debug: false,
  silent: false,
});

function list_post_by_updated(posts) {
  console.log(Array.isArray(posts.data));
  return posts;
}

hexo.extend.helper.register('list_post_by_updated', function (posts) {
  return list_post_by_updated(posts);
});
